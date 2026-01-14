-- Opción 1: Eliminar usuarios con email NULL
DELETE FROM users WHERE email IS NULL;

-- O Opción 2: Actualizar usuarios con email NULL a un valor por defecto
-- UPDATE users SET email = CONCAT('user', id, '@example.com') WHERE email IS NULL;
