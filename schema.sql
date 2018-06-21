CREATE TABLE public.Users
(
    id integer NOT NULL DEFAULT nextval('users_id_seq'::regclass),
    "firstName" character varying(255) COLLATE pg_catalog."default",
    "lastName" character varying(255) COLLATE pg_catalog."default",
    "userName" character varying(255) COLLATE pg_catalog."default",
    email character varying(255) COLLATE pg_catalog."default",
    password character varying(255) COLLATE pg_catalog."default",
    "roleId" character varying(255) COLLATE pg_catalog."default",
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    CONSTRAINT users_pkey PRIMARY KEY (id)
)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;

ALTER TABLE public.users
    OWNER to postgres;

CREATE TABLE public.roles
(
    id integer NOT NULL DEFAULT nextval('roles_id_seq'::regclass),
    title character varying(255) COLLATE pg_catalog."default",
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    CONSTRAINT roles_pkey PRIMARY KEY (id)
)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;

ALTER TABLE public.Roles
    OWNER to postgres;

CREATE TABLE public.Documents
(
    id integer NOT NULL DEFAULT nextval('documents_id_seq'::regclass),
    "userId" character varying(255) COLLATE pg_catalog."default",
    title character varying(255) COLLATE pg_catalog."default",
    content text COLLATE pg_catalog."default",
    access character varying(255) COLLATE pg_catalog."default",
    "userRoleId" character varying(255) COLLATE pg_catalog."default",
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    CONSTRAINT documents_pkey PRIMARY KEY (id)
)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;

ALTER TABLE public.documents
    OWNER to postgres;
