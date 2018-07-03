CREATE TABLE "Users" (
    id integer DEFAULT nextval('"Users_id_seq"'::regclass) PRIMARY KEY,
    "firstName" character varying(255) NOT NULL,
    "lastName" character varying(255) NOT NULL,
    "userName" character varying(255) NOT NULL UNIQUE,
    email character varying(255) NOT NULL UNIQUE,
    password character varying(255) NOT NULL,
    "roleId" integer,
    active boolean NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);

-- Indices -------------------------------------------------------

CREATE UNIQUE INDEX "Users_pkey" ON "Users"(id int4_ops);
CREATE UNIQUE INDEX "Users_userName_key" ON "Users"("userName" text_ops);
CREATE UNIQUE INDEX "Users_email_key" ON "Users"(email text_ops);

-- Table Definition ----------------------------------------------

CREATE TABLE "Roles" (
    id integer DEFAULT nextval('"Roles_id_seq"'::regclass) PRIMARY KEY,
    title character varying(255),
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);

-- Indices -------------------------------------------------------

CREATE UNIQUE INDEX "Roles_pkey" ON "Roles"(id int4_ops);


-- Table Definition ----------------------------------------------

CREATE TABLE "Documents" (
    id integer DEFAULT nextval('"Documents_id_seq"'::regclass) PRIMARY KEY,
    "userId" integer NOT NULL,
    title character varying(255) NOT NULL UNIQUE,
    content text NOT NULL,
    access character varying(255),
    "userRoleId" integer,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);

-- Indices -------------------------------------------------------

CREATE UNIQUE INDEX "Documents_pkey" ON "Documents"(id int4_ops);
CREATE UNIQUE INDEX "Documents_title_key" ON "Documents"(title text_ops);
