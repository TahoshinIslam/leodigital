-- Leotech CMS schema. Compatible with MariaDB 10.4+ (XAMPP) and MySQL 8+.
-- JSON-shaped columns are LONGTEXT so the file runs unchanged on both engines;
-- the application validates their shape on every write.

SET NAMES utf8mb4;

CREATE TABLE IF NOT EXISTS users (
  id              INT UNSIGNED NOT NULL AUTO_INCREMENT,
  name            VARCHAR(120) NOT NULL,
  email           VARCHAR(190) NOT NULL,
  password_hash   VARCHAR(100) NOT NULL,
  role            ENUM('super_admin','admin','editor','viewer') NOT NULL DEFAULT 'viewer',
  is_active       TINYINT(1) NOT NULL DEFAULT 1,
  last_login_at   DATETIME NULL,
  created_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_users_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Server-side sessions. The cookie carries a random token; only its SHA-256
-- hash is stored, so a leaked table cannot be replayed as cookies.
CREATE TABLE IF NOT EXISTS sessions (
  id          CHAR(64) NOT NULL,
  user_id     INT UNSIGNED NOT NULL,
  expires_at  DATETIME NOT NULL,
  ip          VARCHAR(45) NULL,
  user_agent  VARCHAR(255) NULL,
  created_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_sessions_user (user_id),
  KEY idx_sessions_expires (expires_at),
  CONSTRAINT fk_sessions_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS services (
  id               INT UNSIGNED NOT NULL AUTO_INCREMENT,
  slug             VARCHAR(160) NOT NULL,
  title            VARCHAR(160) NOT NULL,
  eyebrow          VARCHAR(120) NULL,
  summary          VARCHAR(500) NOT NULL,
  body             MEDIUMTEXT NULL,            -- Markdown, sanitised on render
  hero_image       VARCHAR(500) NULL,
  hero_image_alt   VARCHAR(250) NULL,
  features         LONGTEXT NULL,              -- JSON [{title, description}]
  process_steps    LONGTEXT NULL,              -- JSON [{title, description}]
  faqs             LONGTEXT NULL,              -- JSON [{question, answer}]
  cta_label        VARCHAR(80) NULL,
  price_from       VARCHAR(80) NULL,
  seo_title        VARCHAR(70) NULL,
  seo_description  VARCHAR(170) NULL,
  og_image         VARCHAR(500) NULL,
  canonical_url    VARCHAR(500) NULL,
  noindex          TINYINT(1) NOT NULL DEFAULT 0,
  status           ENUM('draft','published') NOT NULL DEFAULT 'draft',
  published_at     DATETIME NULL,
  sort_order       INT NOT NULL DEFAULT 0,
  created_by       INT UNSIGNED NULL,
  updated_by       INT UNSIGNED NULL,
  created_at       DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at       DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_services_slug (slug),
  KEY idx_services_status_order (status, sort_order),
  CONSTRAINT fk_services_created_by FOREIGN KEY (created_by) REFERENCES users (id) ON DELETE SET NULL,
  CONSTRAINT fk_services_updated_by FOREIGN KEY (updated_by) REFERENCES users (id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Old slugs keep working (301) after an admin renames a service.
CREATE TABLE IF NOT EXISTS service_slug_history (
  old_slug    VARCHAR(160) NOT NULL,
  service_id  INT UNSIGNED NOT NULL,
  created_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (old_slug),
  KEY idx_slug_history_service (service_id),
  CONSTRAINT fk_slug_history_service FOREIGN KEY (service_id) REFERENCES services (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS media (
  id             INT UNSIGNED NOT NULL AUTO_INCREMENT,
  filename       VARCHAR(80) NOT NULL,
  original_name  VARCHAR(255) NOT NULL,
  mime_type      VARCHAR(40) NOT NULL,
  size_bytes     INT UNSIGNED NOT NULL,
  uploaded_by    INT UNSIGNED NULL,
  created_at     DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_media_filename (filename),
  CONSTRAINT fk_media_user FOREIGN KEY (uploaded_by) REFERENCES users (id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS audit_logs (
  id           BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  user_id      INT UNSIGNED NULL,
  action       VARCHAR(60) NOT NULL,
  entity_type  VARCHAR(40) NOT NULL,
  entity_id    VARCHAR(40) NULL,
  summary      VARCHAR(255) NOT NULL,
  ip           VARCHAR(45) NULL,
  created_at   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_audit_created (created_at),
  CONSTRAINT fk_audit_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
