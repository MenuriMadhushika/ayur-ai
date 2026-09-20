-- Optional one-time additive migration when Hibernate ddl-auto is validate/none.
-- Do not run after ddl-auto=update has already created these columns.
ALTER TABLE skin_scans
    ADD COLUMN skin_type VARCHAR(255) NULL,
    ADD COLUMN skin_type_confidence DOUBLE NULL,
    ADD COLUMN skin_type_predicted_class VARCHAR(255) NULL,
    ADD COLUMN skin_type_requires_review BIT NULL,
    ADD COLUMN sensitivity_score INT NULL;
