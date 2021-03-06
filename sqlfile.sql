--
-- PostgreSQL database dump
--

-- Dumped from database version 10.17
-- Dumped by pg_dump version 10.17

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: plpgsql; Type: EXTENSION; Schema: -; Owner: 
--

CREATE EXTENSION IF NOT EXISTS plpgsql WITH SCHEMA pg_catalog;


--
-- Name: EXTENSION plpgsql; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION plpgsql IS 'PL/pgSQL procedural language';


SET default_tablespace = '';

SET default_with_oids = false;

--
-- Name: blocks; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.blocks (
    id integer NOT NULL,
    chat_id bigint,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public.blocks OWNER TO postgres;

--
-- Name: blocks_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.blocks_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.blocks_id_seq OWNER TO postgres;

--
-- Name: blocks_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.blocks_id_seq OWNED BY public.blocks.id;


--
-- Name: chats; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.chats (
    id integer NOT NULL,
    chat_id bigint NOT NULL,
    chat_title character varying(255) NOT NULL,
    "allowLink" boolean NOT NULL,
    "allowShowParticipation" boolean NOT NULL,
    "allowGreeting" boolean NOT NULL,
    "allowDeleteParticipation" boolean NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public.chats OWNER TO postgres;

--
-- Name: chats_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.chats_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.chats_id_seq OWNER TO postgres;

--
-- Name: chats_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.chats_id_seq OWNED BY public.chats.id;


--
-- Name: filters; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.filters (
    id integer NOT NULL,
    chat_id bigint NOT NULL,
    filter character varying(255)[] NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public.filters OWNER TO postgres;

--
-- Name: filters_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.filters_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.filters_id_seq OWNER TO postgres;

--
-- Name: filters_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.filters_id_seq OWNED BY public.filters.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id integer NOT NULL,
    user_id bigint NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public.users OWNER TO postgres;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.users_id_seq OWNER TO postgres;

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: blocks id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.blocks ALTER COLUMN id SET DEFAULT nextval('public.blocks_id_seq'::regclass);


--
-- Name: chats id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.chats ALTER COLUMN id SET DEFAULT nextval('public.chats_id_seq'::regclass);


--
-- Name: filters id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.filters ALTER COLUMN id SET DEFAULT nextval('public.filters_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Data for Name: blocks; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.blocks (id, chat_id, "createdAt", "updatedAt") FROM stdin;
2	1384147709	2021-07-13 00:28:01.169-07	2021-07-13 00:28:01.169-07
7	-1001582780391	2021-07-15 00:34:26.086-07	2021-07-15 00:34:26.086-07
8	-1001582780391	2021-07-15 00:34:26.239-07	2021-07-15 00:34:26.239-07
9	961624783	2021-07-15 04:40:03.073-07	2021-07-15 04:40:03.073-07
10	789197192	2021-07-15 04:40:04.441-07	2021-07-15 04:40:04.441-07
11	789197192	2021-07-15 04:40:04.507-07	2021-07-15 04:40:04.507-07
12	-1001453042853	2021-07-16 07:09:51.971-07	2021-07-16 07:09:51.971-07
\.


--
-- Data for Name: chats; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.chats (id, chat_id, chat_title, "allowLink", "allowShowParticipation", "allowGreeting", "allowDeleteParticipation", "createdAt", "updatedAt") FROM stdin;
4	-1001438855495	Test	f	f	t	t	2021-07-13 10:31:04.325-07	2021-07-15 02:01:18.08-07
10	-467154093	test	f	f	t	t	2021-07-21 23:37:27.87-07	2021-07-21 23:37:27.87-07
11	-1001509036526	test	t	f	t	t	2021-07-22 00:21:15.003-07	2021-07-22 00:21:30.335-07
12	-1001539784179	Asadbek Zoirov Chat	f	f	t	t	2021-07-22 06:16:39.161-07	2021-07-22 06:16:39.161-07
\.


--
-- Data for Name: filters; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.filters (id, chat_id, filter, "createdAt", "updatedAt") FROM stdin;
2	-1001438855495	{so'z}	2021-07-15 01:55:32.359-07	2021-07-15 01:55:32.385-07
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, user_id, "createdAt", "updatedAt") FROM stdin;
2	815280285	2021-07-12 21:44:53.405-07	2021-07-12 21:44:53.405-07
5	982421743	2021-07-13 10:30:18.081-07	2021-07-13 10:30:18.081-07
6	982421743	2021-07-13 10:30:18.088-07	2021-07-13 10:30:18.088-07
4	3564040	2021-07-13 10:30:18.083-07	2021-07-13 10:30:18.083-07
7	1374792860	2021-07-13 10:30:18.091-07	2021-07-13 10:30:18.091-07
8	1027231205	2021-07-13 12:32:03.101-07	2021-07-13 12:32:03.101-07
9	696446096	2021-07-14 11:24:43.448-07	2021-07-14 11:24:43.448-07
10	696446096	2021-07-14 11:24:43.457-07	2021-07-14 11:24:43.457-07
11	1067550077	2021-07-14 11:24:43.46-07	2021-07-14 11:24:43.46-07
12	696446096	2021-07-14 11:24:43.461-07	2021-07-14 11:24:43.461-07
14	696446096	2021-07-14 11:24:43.464-07	2021-07-14 11:24:43.464-07
16	696446096	2021-07-14 11:24:43.466-07	2021-07-14 11:24:43.466-07
17	1521925160	2021-07-14 11:26:46.795-07	2021-07-14 11:26:46.795-07
18	285616200	2021-07-15 00:34:26.043-07	2021-07-15 00:34:26.043-07
19	800124341	2021-07-16 07:09:51.806-07	2021-07-16 07:09:51.806-07
20	871720174	2021-07-16 07:09:51.815-07	2021-07-16 07:09:51.815-07
21	630680161	2021-07-16 07:09:51.817-07	2021-07-16 07:09:51.817-07
22	630680161	2021-07-16 07:09:51.818-07	2021-07-16 07:09:51.818-07
23	1365204633	2021-07-18 23:47:21.847-07	2021-07-18 23:47:21.847-07
24	1365204633	2021-07-18 23:47:21.838-07	2021-07-18 23:47:21.838-07
25	1501965358	2021-07-21 23:30:23.812-07	2021-07-21 23:30:23.812-07
\.


--
-- Name: blocks_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.blocks_id_seq', 12, true);


--
-- Name: chats_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.chats_id_seq', 12, true);


--
-- Name: filters_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.filters_id_seq', 2, true);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_id_seq', 25, true);


--
-- Name: blocks blocks_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.blocks
    ADD CONSTRAINT blocks_pkey PRIMARY KEY (id);


--
-- Name: chats chats_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.chats
    ADD CONSTRAINT chats_pkey PRIMARY KEY (id);


--
-- Name: filters filters_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.filters
    ADD CONSTRAINT filters_pkey PRIMARY KEY (id);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- PostgreSQL database dump complete
--

