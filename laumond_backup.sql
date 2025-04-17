--
-- PostgreSQL database dump
--

-- Dumped from database version 14.13 (Homebrew)
-- Dumped by pg_dump version 14.13 (Homebrew)

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

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: Artwork; Type: TABLE; Schema: public; Owner: paulo
--

CREATE TABLE public."Artwork" (
    id integer NOT NULL,
    title text NOT NULL,
    "categoryId" integer NOT NULL,
    subcategory text NOT NULL,
    "folderPath" text NOT NULL,
    "imageUrls" text NOT NULL,
    description text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Artwork" OWNER TO paulo;

--
-- Name: Artwork_id_seq; Type: SEQUENCE; Schema: public; Owner: paulo
--

CREATE SEQUENCE public."Artwork_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."Artwork_id_seq" OWNER TO paulo;

--
-- Name: Artwork_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: paulo
--

ALTER SEQUENCE public."Artwork_id_seq" OWNED BY public."Artwork".id;


--
-- Name: Category; Type: TABLE; Schema: public; Owner: paulo
--

CREATE TABLE public."Category" (
    id integer NOT NULL,
    name text NOT NULL,
    path text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Category" OWNER TO paulo;

--
-- Name: Category_id_seq; Type: SEQUENCE; Schema: public; Owner: paulo
--

CREATE SEQUENCE public."Category_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."Category_id_seq" OWNER TO paulo;

--
-- Name: Category_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: paulo
--

ALTER SEQUENCE public."Category_id_seq" OWNED BY public."Category".id;


--
-- Name: User; Type: TABLE; Schema: public; Owner: paulo
--

CREATE TABLE public."User" (
    id integer NOT NULL,
    username text NOT NULL,
    password text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."User" OWNER TO paulo;

--
-- Name: User_id_seq; Type: SEQUENCE; Schema: public; Owner: paulo
--

CREATE SEQUENCE public."User_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."User_id_seq" OWNER TO paulo;

--
-- Name: User_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: paulo
--

ALTER SEQUENCE public."User_id_seq" OWNED BY public."User".id;


--
-- Name: _prisma_migrations; Type: TABLE; Schema: public; Owner: paulo
--

CREATE TABLE public._prisma_migrations (
    id character varying(36) NOT NULL,
    checksum character varying(64) NOT NULL,
    finished_at timestamp with time zone,
    migration_name character varying(255) NOT NULL,
    logs text,
    rolled_back_at timestamp with time zone,
    started_at timestamp with time zone DEFAULT now() NOT NULL,
    applied_steps_count integer DEFAULT 0 NOT NULL
);


ALTER TABLE public._prisma_migrations OWNER TO paulo;

--
-- Name: Artwork id; Type: DEFAULT; Schema: public; Owner: paulo
--

ALTER TABLE ONLY public."Artwork" ALTER COLUMN id SET DEFAULT nextval('public."Artwork_id_seq"'::regclass);


--
-- Name: Category id; Type: DEFAULT; Schema: public; Owner: paulo
--

ALTER TABLE ONLY public."Category" ALTER COLUMN id SET DEFAULT nextval('public."Category_id_seq"'::regclass);


--
-- Name: User id; Type: DEFAULT; Schema: public; Owner: paulo
--

ALTER TABLE ONLY public."User" ALTER COLUMN id SET DEFAULT nextval('public."User_id_seq"'::regclass);


--
-- Data for Name: Artwork; Type: TABLE DATA; Schema: public; Owner: paulo
--

COPY public."Artwork" (id, title, "categoryId", subcategory, "folderPath", "imageUrls", description, "createdAt", "updatedAt") FROM stdin;
1	Le Détachement De Soi - Image 1	1	10	Transcriptions/10	["https://plaumondpicture.s3.eu-west-3.amazonaws.com/Transcriptions/10/01.jpg"]	\N	2025-04-16 18:03:57.357	2025-04-16 18:03:57.357
2	Le Détachement De Soi - Image 2	1	10	Transcriptions/10	["https://plaumondpicture.s3.eu-west-3.amazonaws.com/Transcriptions/10/02.jpg"]	\N	2025-04-16 18:03:57.364	2025-04-16 18:03:57.364
3	Le Détachement De Soi - Image 3	1	10	Transcriptions/10	["https://plaumondpicture.s3.eu-west-3.amazonaws.com/Transcriptions/10/03.jpg"]	\N	2025-04-16 18:03:57.368	2025-04-16 18:03:57.368
4	Le Détachement De Soi - Image 4	1	10	Transcriptions/10	["https://plaumondpicture.s3.eu-west-3.amazonaws.com/Transcriptions/10/04.jpg"]	\N	2025-04-16 18:03:57.375	2025-04-16 18:03:57.375
5	Hors Du Dedans - Image 1	1	11	Transcriptions/11	["https://plaumondpicture.s3.eu-west-3.amazonaws.com/Transcriptions/11/01.jpg"]	\N	2025-04-16 18:03:57.383	2025-04-16 18:03:57.383
6	Hors Du Dedans - Image 2	1	11	Transcriptions/11	["https://plaumondpicture.s3.eu-west-3.amazonaws.com/Transcriptions/11/02.jpg"]	\N	2025-04-16 18:03:57.385	2025-04-16 18:03:57.385
7	Hors Du Dedans - Image 3	1	11	Transcriptions/11	["https://plaumondpicture.s3.eu-west-3.amazonaws.com/Transcriptions/11/03.jpg"]	\N	2025-04-16 18:03:57.391	2025-04-16 18:03:57.391
8	Hors Du Dedans - Image 4	1	11	Transcriptions/11	["https://plaumondpicture.s3.eu-west-3.amazonaws.com/Transcriptions/11/04.jpg"]	\N	2025-04-16 18:03:57.393	2025-04-16 18:03:57.393
9	Hors Du Dedans - Image 5	1	11	Transcriptions/11	["https://plaumondpicture.s3.eu-west-3.amazonaws.com/Transcriptions/11/05.jpg"]	\N	2025-04-16 18:03:57.395	2025-04-16 18:03:57.395
10	L'Inextricable Enchevêtrement Du Réel - Image 1	1	12	Transcriptions/12	["https://plaumondpicture.s3.eu-west-3.amazonaws.com/Transcriptions/12/01.jpg"]	\N	2025-04-16 18:03:57.4	2025-04-16 18:03:57.4
11	L'Inextricable Enchevêtrement Du Réel - Image 2	1	12	Transcriptions/12	["https://plaumondpicture.s3.eu-west-3.amazonaws.com/Transcriptions/12/02.jpg"]	\N	2025-04-16 18:03:57.402	2025-04-16 18:03:57.402
12	L'Inextricable Enchevêtrement Du Réel - Image 3	1	12	Transcriptions/12	["https://plaumondpicture.s3.eu-west-3.amazonaws.com/Transcriptions/12/03.jpg"]	\N	2025-04-16 18:03:57.404	2025-04-16 18:03:57.404
13	L'Inextricable Enchevêtrement Du Réel - Image 4	1	12	Transcriptions/12	["https://plaumondpicture.s3.eu-west-3.amazonaws.com/Transcriptions/12/04.jpg"]	\N	2025-04-16 18:03:57.405	2025-04-16 18:03:57.405
14	Le Tout - Image 1	1	13	Transcriptions/13	["https://plaumondpicture.s3.eu-west-3.amazonaws.com/Transcriptions/13/01.jpg"]	\N	2025-04-16 18:03:57.407	2025-04-16 18:03:57.407
15	Le Tout - Image 2	1	13	Transcriptions/13	["https://plaumondpicture.s3.eu-west-3.amazonaws.com/Transcriptions/13/02.jpg"]	\N	2025-04-16 18:03:57.408	2025-04-16 18:03:57.408
16	Le Tout - Image 3	1	13	Transcriptions/13	["https://plaumondpicture.s3.eu-west-3.amazonaws.com/Transcriptions/13/03.jpg"]	\N	2025-04-16 18:03:57.409	2025-04-16 18:03:57.409
17	Le Tout - Image 4	1	13	Transcriptions/13	["https://plaumondpicture.s3.eu-west-3.amazonaws.com/Transcriptions/13/04.jpg"]	\N	2025-04-16 18:03:57.41	2025-04-16 18:03:57.41
18	Le Tout - Image 5	1	13	Transcriptions/13	["https://plaumondpicture.s3.eu-west-3.amazonaws.com/Transcriptions/13/05.jpg"]	\N	2025-04-16 18:03:57.411	2025-04-16 18:03:57.411
19	L'Effet H.Casimir - Image 1	1	14	Transcriptions/14	["https://plaumondpicture.s3.eu-west-3.amazonaws.com/Transcriptions/14/01.jpg"]	\N	2025-04-16 18:03:57.412	2025-04-16 18:03:57.412
20	L'Effet H.Casimir - Image 2	1	14	Transcriptions/14	["https://plaumondpicture.s3.eu-west-3.amazonaws.com/Transcriptions/14/02.jpg"]	\N	2025-04-16 18:03:57.416	2025-04-16 18:03:57.416
21	L'Effet H.Casimir - Image 3	1	14	Transcriptions/14	["https://plaumondpicture.s3.eu-west-3.amazonaws.com/Transcriptions/14/03.jpg"]	\N	2025-04-16 18:03:57.418	2025-04-16 18:03:57.418
22	L'Effet H.Casimir - Image 4	1	14	Transcriptions/14	["https://plaumondpicture.s3.eu-west-3.amazonaws.com/Transcriptions/14/04.jpg"]	\N	2025-04-16 18:03:57.419	2025-04-16 18:03:57.419
23	L'Intrication Quantique - Image 1	1	15	Transcriptions/15	["https://plaumondpicture.s3.eu-west-3.amazonaws.com/Transcriptions/15/01.jpg"]	\N	2025-04-16 18:03:57.42	2025-04-16 18:03:57.42
24	L'Intrication Quantique - Image 2	1	15	Transcriptions/15	["https://plaumondpicture.s3.eu-west-3.amazonaws.com/Transcriptions/15/02.jpg"]	\N	2025-04-16 18:03:57.421	2025-04-16 18:03:57.421
25	L'Intrication Quantique - Image 3	1	15	Transcriptions/15	["https://plaumondpicture.s3.eu-west-3.amazonaws.com/Transcriptions/15/03.jpg"]	\N	2025-04-16 18:03:57.423	2025-04-16 18:03:57.423
26	L'Intrication Quantique - Image 4	1	15	Transcriptions/15	["https://plaumondpicture.s3.eu-west-3.amazonaws.com/Transcriptions/15/04.jpg"]	\N	2025-04-16 18:03:57.424	2025-04-16 18:03:57.424
27	L'Intrication Quantique - Image 5	1	15	Transcriptions/15	["https://plaumondpicture.s3.eu-west-3.amazonaws.com/Transcriptions/15/05.jpg"]	\N	2025-04-16 18:03:57.425	2025-04-16 18:03:57.425
28	Aléa Du Mi-Clos - Image 1	1	16	Transcriptions/16	["https://plaumondpicture.s3.eu-west-3.amazonaws.com/Transcriptions/16/01.jpg"]	\N	2025-04-16 18:03:57.427	2025-04-16 18:03:57.427
29	Aléa Du Mi-Clos - Image 2	1	16	Transcriptions/16	["https://plaumondpicture.s3.eu-west-3.amazonaws.com/Transcriptions/16/02.jpg"]	\N	2025-04-16 18:03:57.428	2025-04-16 18:03:57.428
30	Aléa Du Mi-Clos - Image 3	1	16	Transcriptions/16	["https://plaumondpicture.s3.eu-west-3.amazonaws.com/Transcriptions/16/03.jpg"]	\N	2025-04-16 18:03:57.431	2025-04-16 18:03:57.431
31	Aléa Du Mi-Clos - Image 4	1	16	Transcriptions/16	["https://plaumondpicture.s3.eu-west-3.amazonaws.com/Transcriptions/16/04.jpg"]	\N	2025-04-16 18:03:57.433	2025-04-16 18:03:57.433
32	Le Corps De L'Esprit De L'Âme - Image 1	1	17	Transcriptions/17	["https://plaumondpicture.s3.eu-west-3.amazonaws.com/Transcriptions/17/01.jpg"]	\N	2025-04-16 18:03:57.437	2025-04-16 18:03:57.437
33	Le Corps De L'Esprit De L'Âme - Image 2	1	17	Transcriptions/17	["https://plaumondpicture.s3.eu-west-3.amazonaws.com/Transcriptions/17/02.jpg"]	\N	2025-04-16 18:03:57.439	2025-04-16 18:03:57.439
34	Le Corps De L'Esprit De L'Âme - Image 3	1	17	Transcriptions/17	["https://plaumondpicture.s3.eu-west-3.amazonaws.com/Transcriptions/17/03.jpg"]	\N	2025-04-16 18:03:57.441	2025-04-16 18:03:57.441
35	Le Corps De L'Esprit De L'Âme - Image 4	1	17	Transcriptions/17	["https://plaumondpicture.s3.eu-west-3.amazonaws.com/Transcriptions/17/04.jpg"]	\N	2025-04-16 18:03:57.444	2025-04-16 18:03:57.444
36	Le Corps De L'Esprit De L'Âme - Image 5	1	17	Transcriptions/17	["https://plaumondpicture.s3.eu-west-3.amazonaws.com/Transcriptions/17/05.jpg"]	\N	2025-04-16 18:03:57.446	2025-04-16 18:03:57.446
37	L'Œuvre De Damoclès Et L'Energie Quantique De La Pensée - Image 1	1	01	Transcriptions/01	["https://plaumondpicture.s3.eu-west-3.amazonaws.com/Transcriptions/01/01.jpg"]	\N	2025-04-16 18:03:57.448	2025-04-16 18:03:57.448
38	L'Œuvre De Damoclès Et L'Energie Quantique De La Pensée - Image 2	1	01	Transcriptions/01	["https://plaumondpicture.s3.eu-west-3.amazonaws.com/Transcriptions/01/02.jpg"]	\N	2025-04-16 18:03:57.449	2025-04-16 18:03:57.449
39	L'Œuvre De Damoclès Et L'Energie Quantique De La Pensée - Image 3	1	01	Transcriptions/01	["https://plaumondpicture.s3.eu-west-3.amazonaws.com/Transcriptions/01/03.jpg"]	\N	2025-04-16 18:03:57.455	2025-04-16 18:03:57.455
79	Vice-Versa - Image 2	2	02	Archetypes/02	["https://plaumondpicture.s3.eu-west-3.amazonaws.com/Archetypes/02/02.jpg"]	\N	2025-04-16 18:03:57.543	2025-04-16 18:03:57.543
40	L'Œuvre De Damoclès Et L'Energie Quantique De La Pensée - Image 4	1	01	Transcriptions/01	["https://plaumondpicture.s3.eu-west-3.amazonaws.com/Transcriptions/01/04.jpg"]	\N	2025-04-16 18:03:57.461	2025-04-16 18:03:57.461
41	L'Œuvre De Damoclès Et L'Energie Quantique De La Pensée - Image 5	1	01	Transcriptions/01	["https://plaumondpicture.s3.eu-west-3.amazonaws.com/Transcriptions/01/05.jpg"]	\N	2025-04-16 18:03:57.463	2025-04-16 18:03:57.463
42	L'Ascension Potentielle - Image 1	1	02	Transcriptions/02	["https://plaumondpicture.s3.eu-west-3.amazonaws.com/Transcriptions/02/01.jpg"]	\N	2025-04-16 18:03:57.466	2025-04-16 18:03:57.466
43	L'Ascension Potentielle - Image 2	1	02	Transcriptions/02	["https://plaumondpicture.s3.eu-west-3.amazonaws.com/Transcriptions/02/02.jpg"]	\N	2025-04-16 18:03:57.468	2025-04-16 18:03:57.468
44	L'Ascension Potentielle - Image 3	1	02	Transcriptions/02	["https://plaumondpicture.s3.eu-west-3.amazonaws.com/Transcriptions/02/03.jpg"]	\N	2025-04-16 18:03:57.473	2025-04-16 18:03:57.473
45	L'Ascension Potentielle - Image 4	1	02	Transcriptions/02	["https://plaumondpicture.s3.eu-west-3.amazonaws.com/Transcriptions/02/04.jpg"]	\N	2025-04-16 18:03:57.476	2025-04-16 18:03:57.476
46	Les Cinq Points Cardinaux - Quinta Essentia - Image 1	1	03	Transcriptions/03	["https://plaumondpicture.s3.eu-west-3.amazonaws.com/Transcriptions/03/01.jpg"]	\N	2025-04-16 18:03:57.478	2025-04-16 18:03:57.478
47	Les Cinq Points Cardinaux - Quinta Essentia - Image 2	1	03	Transcriptions/03	["https://plaumondpicture.s3.eu-west-3.amazonaws.com/Transcriptions/03/02.jpg"]	\N	2025-04-16 18:03:57.48	2025-04-16 18:03:57.48
48	Les Cinq Points Cardinaux - Quinta Essentia - Image 3	1	03	Transcriptions/03	["https://plaumondpicture.s3.eu-west-3.amazonaws.com/Transcriptions/03/03.jpg"]	\N	2025-04-16 18:03:57.48	2025-04-16 18:03:57.48
49	Les Cinq Points Cardinaux - Quinta Essentia - Image 4	1	03	Transcriptions/03	["https://plaumondpicture.s3.eu-west-3.amazonaws.com/Transcriptions/03/04.jpg"]	\N	2025-04-16 18:03:57.481	2025-04-16 18:03:57.481
50	Les Cinq Points Cardinaux - Quinta Essentia - Image 5	1	03	Transcriptions/03	["https://plaumondpicture.s3.eu-west-3.amazonaws.com/Transcriptions/03/05.jpg"]	\N	2025-04-16 18:03:57.482	2025-04-16 18:03:57.482
51	L'Interdépendance Universelle - Image 1	1	04	Transcriptions/04	["https://plaumondpicture.s3.eu-west-3.amazonaws.com/Transcriptions/04/01.jpg"]	\N	2025-04-16 18:03:57.483	2025-04-16 18:03:57.483
52	L'Interdépendance Universelle - Image 2	1	04	Transcriptions/04	["https://plaumondpicture.s3.eu-west-3.amazonaws.com/Transcriptions/04/02.jpg"]	\N	2025-04-16 18:03:57.484	2025-04-16 18:03:57.484
53	L'Interdépendance Universelle - Image 3	1	04	Transcriptions/04	["https://plaumondpicture.s3.eu-west-3.amazonaws.com/Transcriptions/04/03.jpg"]	\N	2025-04-16 18:03:57.486	2025-04-16 18:03:57.486
54	L'Interdépendance Universelle - Image 4	1	04	Transcriptions/04	["https://plaumondpicture.s3.eu-west-3.amazonaws.com/Transcriptions/04/04.jpg"]	\N	2025-04-16 18:03:57.489	2025-04-16 18:03:57.489
55	La Puissance De La Résistance - Image 1	1	05	Transcriptions/05	["https://plaumondpicture.s3.eu-west-3.amazonaws.com/Transcriptions/05/01.jpg"]	\N	2025-04-16 18:03:57.491	2025-04-16 18:03:57.491
56	La Puissance De La Résistance - Image 2	1	05	Transcriptions/05	["https://plaumondpicture.s3.eu-west-3.amazonaws.com/Transcriptions/05/02.jpg"]	\N	2025-04-16 18:03:57.496	2025-04-16 18:03:57.496
57	La Puissance De La Résistance - Image 3	1	05	Transcriptions/05	["https://plaumondpicture.s3.eu-west-3.amazonaws.com/Transcriptions/05/03.jpg"]	\N	2025-04-16 18:03:57.497	2025-04-16 18:03:57.497
58	La Puissance De La Résistance - Image 4	1	05	Transcriptions/05	["https://plaumondpicture.s3.eu-west-3.amazonaws.com/Transcriptions/05/04.jpg"]	\N	2025-04-16 18:03:57.501	2025-04-16 18:03:57.501
59	La Puissance De La Résistance - Image 5	1	05	Transcriptions/05	["https://plaumondpicture.s3.eu-west-3.amazonaws.com/Transcriptions/05/05.jpg"]	\N	2025-04-16 18:03:57.503	2025-04-16 18:03:57.503
60	Le Grand Saut - Image 1	1	06	Transcriptions/06	["https://plaumondpicture.s3.eu-west-3.amazonaws.com/Transcriptions/06/01.jpg"]	\N	2025-04-16 18:03:57.509	2025-04-16 18:03:57.509
61	Le Grand Saut - Image 2	1	06	Transcriptions/06	["https://plaumondpicture.s3.eu-west-3.amazonaws.com/Transcriptions/06/02.jpg"]	\N	2025-04-16 18:03:57.511	2025-04-16 18:03:57.511
62	Le Grand Saut - Image 3	1	06	Transcriptions/06	["https://plaumondpicture.s3.eu-west-3.amazonaws.com/Transcriptions/06/03.jpg"]	\N	2025-04-16 18:03:57.513	2025-04-16 18:03:57.513
63	Le Grand Saut - Image 4	1	06	Transcriptions/06	["https://plaumondpicture.s3.eu-west-3.amazonaws.com/Transcriptions/06/04.jpg"]	\N	2025-04-16 18:03:57.515	2025-04-16 18:03:57.515
64	L'Aube Du Soulèvement De L'Invisible - Image 1	1	07	Transcriptions/07	["https://plaumondpicture.s3.eu-west-3.amazonaws.com/Transcriptions/07/01.jpg"]	\N	2025-04-16 18:03:57.516	2025-04-16 18:03:57.516
65	L'Aube Du Soulèvement De L'Invisible - Image 2	1	07	Transcriptions/07	["https://plaumondpicture.s3.eu-west-3.amazonaws.com/Transcriptions/07/02.jpg"]	\N	2025-04-16 18:03:57.517	2025-04-16 18:03:57.517
66	L'Aube Du Soulèvement De L'Invisible - Image 3	1	07	Transcriptions/07	["https://plaumondpicture.s3.eu-west-3.amazonaws.com/Transcriptions/07/03.jpg"]	\N	2025-04-16 18:03:57.518	2025-04-16 18:03:57.518
67	L'Aube Du Soulèvement De L'Invisible - Image 4	1	07	Transcriptions/07	["https://plaumondpicture.s3.eu-west-3.amazonaws.com/Transcriptions/07/04.jpg"]	\N	2025-04-16 18:03:57.519	2025-04-16 18:03:57.519
68	L'Aube Du Soulèvement De L'Invisible - Image 5	1	07	Transcriptions/07	["https://plaumondpicture.s3.eu-west-3.amazonaws.com/Transcriptions/07/05.jpg"]	\N	2025-04-16 18:03:57.52	2025-04-16 18:03:57.52
69	L'Energie Du Vide - Image 1	1	08	Transcriptions/08	["https://plaumondpicture.s3.eu-west-3.amazonaws.com/Transcriptions/08/01.jpg"]	\N	2025-04-16 18:03:57.521	2025-04-16 18:03:57.521
70	L'Energie Du Vide - Image 2	1	08	Transcriptions/08	["https://plaumondpicture.s3.eu-west-3.amazonaws.com/Transcriptions/08/02.jpg"]	\N	2025-04-16 18:03:57.522	2025-04-16 18:03:57.522
71	L'Energie Du Vide - Image 3	1	08	Transcriptions/08	["https://plaumondpicture.s3.eu-west-3.amazonaws.com/Transcriptions/08/03.jpg"]	\N	2025-04-16 18:03:57.523	2025-04-16 18:03:57.523
72	L'Energie Du Vide - Image 4	1	08	Transcriptions/08	["https://plaumondpicture.s3.eu-west-3.amazonaws.com/Transcriptions/08/04.jpg"]	\N	2025-04-16 18:03:57.524	2025-04-16 18:03:57.524
73	Le Mythe De Pandore - Image 1	1	09	Transcriptions/09	["https://plaumondpicture.s3.eu-west-3.amazonaws.com/Transcriptions/09/01.jpg"]	\N	2025-04-16 18:03:57.527	2025-04-16 18:03:57.527
74	Le Mythe De Pandore - Image 2	1	09	Transcriptions/09	["https://plaumondpicture.s3.eu-west-3.amazonaws.com/Transcriptions/09/02.jpg"]	\N	2025-04-16 18:03:57.528	2025-04-16 18:03:57.528
75	Le Mythe De Pandore - Image 3	1	09	Transcriptions/09	["https://plaumondpicture.s3.eu-west-3.amazonaws.com/Transcriptions/09/03.jpg"]	\N	2025-04-16 18:03:57.53	2025-04-16 18:03:57.53
76	Le Mythe De Pandore - Image 4	1	09	Transcriptions/09	["https://plaumondpicture.s3.eu-west-3.amazonaws.com/Transcriptions/09/04.jpg"]	\N	2025-04-16 18:03:57.531	2025-04-16 18:03:57.531
77	Le Mythe De Pandore - Image 5	1	09	Transcriptions/09	["https://plaumondpicture.s3.eu-west-3.amazonaws.com/Transcriptions/09/05.jpg"]	\N	2025-04-16 18:03:57.532	2025-04-16 18:03:57.532
78	Vice-Versa - Image 1	2	02	Archetypes/02	["https://plaumondpicture.s3.eu-west-3.amazonaws.com/Archetypes/02/01.jpg"]	\N	2025-04-16 18:03:57.541	2025-04-16 18:03:57.541
80	Vice-Versa - Image 3	2	02	Archetypes/02	["https://plaumondpicture.s3.eu-west-3.amazonaws.com/Archetypes/02/03.jpg"]	\N	2025-04-16 18:03:57.544	2025-04-16 18:03:57.544
81	Vice-Versa - Image 4	2	02	Archetypes/02	["https://plaumondpicture.s3.eu-west-3.amazonaws.com/Archetypes/02/04.jpg"]	\N	2025-04-16 18:03:57.546	2025-04-16 18:03:57.546
82	Equilibrium - Image 1	2	03	Archetypes/03	["https://plaumondpicture.s3.eu-west-3.amazonaws.com/Archetypes/03/01.jpg"]	\N	2025-04-16 18:03:57.55	2025-04-16 18:03:57.55
83	Equilibrium - Image 2	2	03	Archetypes/03	["https://plaumondpicture.s3.eu-west-3.amazonaws.com/Archetypes/03/02.jpg"]	\N	2025-04-16 18:03:57.551	2025-04-16 18:03:57.551
84	Equilibrium - Image 3	2	03	Archetypes/03	["https://plaumondpicture.s3.eu-west-3.amazonaws.com/Archetypes/03/03.jpg"]	\N	2025-04-16 18:03:57.554	2025-04-16 18:03:57.554
85	Equilibrium - Image 4	2	03	Archetypes/03	["https://plaumondpicture.s3.eu-west-3.amazonaws.com/Archetypes/03/04.jpg"]	\N	2025-04-16 18:03:57.557	2025-04-16 18:03:57.557
86	Equilibrium - Image 5	2	03	Archetypes/03	["https://plaumondpicture.s3.eu-west-3.amazonaws.com/Archetypes/03/05.jpg"]	\N	2025-04-16 18:03:57.56	2025-04-16 18:03:57.56
87	Double Pression - Effet De Mouvement De Rotation Central - Image 1	2	04	Archetypes/04	["https://plaumondpicture.s3.eu-west-3.amazonaws.com/Archetypes/04/01.jpg"]	\N	2025-04-16 18:03:57.562	2025-04-16 18:03:57.562
88	Double Pression - Effet De Mouvement De Rotation Central - Image 2	2	04	Archetypes/04	["https://plaumondpicture.s3.eu-west-3.amazonaws.com/Archetypes/04/02.jpg"]	\N	2025-04-16 18:03:57.563	2025-04-16 18:03:57.563
89	Double Pression - Effet De Mouvement De Rotation Central - Image 3	2	04	Archetypes/04	["https://plaumondpicture.s3.eu-west-3.amazonaws.com/Archetypes/04/03.jpg"]	\N	2025-04-16 18:03:57.566	2025-04-16 18:03:57.566
90	Double Pression - Effet De Mouvement De Rotation Central - Image 4	2	04	Archetypes/04	["https://plaumondpicture.s3.eu-west-3.amazonaws.com/Archetypes/04/04.jpg"]	\N	2025-04-16 18:03:57.569	2025-04-16 18:03:57.569
91	L'Infini - Image 1	2	05	Archetypes/05	["https://plaumondpicture.s3.eu-west-3.amazonaws.com/Archetypes/05/01.jpg"]	\N	2025-04-16 18:03:57.574	2025-04-16 18:03:57.574
92	L'Infini - Image 2	2	05	Archetypes/05	["https://plaumondpicture.s3.eu-west-3.amazonaws.com/Archetypes/05/02.jpg"]	\N	2025-04-16 18:03:57.583	2025-04-16 18:03:57.583
93	L'Infini - Image 3	2	05	Archetypes/05	["https://plaumondpicture.s3.eu-west-3.amazonaws.com/Archetypes/05/03.jpg"]	\N	2025-04-16 18:03:57.586	2025-04-16 18:03:57.586
94	L'Infini - Image 4	2	05	Archetypes/05	["https://plaumondpicture.s3.eu-west-3.amazonaws.com/Archetypes/05/04.jpg"]	\N	2025-04-16 18:03:57.588	2025-04-16 18:03:57.588
95	L'Infini - Image 5	2	05	Archetypes/05	["https://plaumondpicture.s3.eu-west-3.amazonaws.com/Archetypes/05/05.jpg"]	\N	2025-04-16 18:03:57.59	2025-04-16 18:03:57.59
96	Retrait - Collection Privée - Image 1	2	06	Archetypes/06	["https://plaumondpicture.s3.eu-west-3.amazonaws.com/Archetypes/06/01.jpg"]	\N	2025-04-16 18:03:57.592	2025-04-16 18:03:57.592
97	Retrait - Collection Privée - Image 2	2	06	Archetypes/06	["https://plaumondpicture.s3.eu-west-3.amazonaws.com/Archetypes/06/02.jpg"]	\N	2025-04-16 18:03:57.597	2025-04-16 18:03:57.597
98	Retrait - Collection Privée - Image 3	2	06	Archetypes/06	["https://plaumondpicture.s3.eu-west-3.amazonaws.com/Archetypes/06/03.jpg"]	\N	2025-04-16 18:03:57.6	2025-04-16 18:03:57.6
99	Retrait - Collection Privée - Image 4	2	06	Archetypes/06	["https://plaumondpicture.s3.eu-west-3.amazonaws.com/Archetypes/06/04.jpg"]	\N	2025-04-16 18:03:57.602	2025-04-16 18:03:57.602
100	Mutation De La Pensée Globale - Image 1	2	07	Archetypes/07	["https://plaumondpicture.s3.eu-west-3.amazonaws.com/Archetypes/07/01.jpg"]	\N	2025-04-16 18:03:57.604	2025-04-16 18:03:57.604
101	Mutation De La Pensée Globale - Image 2	2	07	Archetypes/07	["https://plaumondpicture.s3.eu-west-3.amazonaws.com/Archetypes/07/02.jpg"]	\N	2025-04-16 18:03:57.611	2025-04-16 18:03:57.611
102	Mutation De La Pensée Globale - Image 3	2	07	Archetypes/07	["https://plaumondpicture.s3.eu-west-3.amazonaws.com/Archetypes/07/03.jpg"]	\N	2025-04-16 18:03:57.614	2025-04-16 18:03:57.614
103	Mutation De La Pensée Globale - Image 4	2	07	Archetypes/07	["https://plaumondpicture.s3.eu-west-3.amazonaws.com/Archetypes/07/04.jpg"]	\N	2025-04-16 18:03:57.618	2025-04-16 18:03:57.618
104	Mutation De La Pensée Globale - Image 5	2	07	Archetypes/07	["https://plaumondpicture.s3.eu-west-3.amazonaws.com/Archetypes/07/05.jpg"]	\N	2025-04-16 18:03:57.62	2025-04-16 18:03:57.62
105	Brisure De Symétrie - Image 1	2	08	Archetypes/08	["https://plaumondpicture.s3.eu-west-3.amazonaws.com/Archetypes/08/01.jpg"]	\N	2025-04-16 18:03:57.626	2025-04-16 18:03:57.626
106	Brisure De Symétrie - Image 2	2	08	Archetypes/08	["https://plaumondpicture.s3.eu-west-3.amazonaws.com/Archetypes/08/02.jpg"]	\N	2025-04-16 18:03:57.627	2025-04-16 18:03:57.627
107	Brisure De Symétrie - Image 3	2	08	Archetypes/08	["https://plaumondpicture.s3.eu-west-3.amazonaws.com/Archetypes/08/03.jpg"]	\N	2025-04-16 18:03:57.629	2025-04-16 18:03:57.629
108	Brisure De Symétrie - Image 4	2	08	Archetypes/08	["https://plaumondpicture.s3.eu-west-3.amazonaws.com/Archetypes/08/04.jpg"]	\N	2025-04-16 18:03:57.632	2025-04-16 18:03:57.632
109	Outreconscience - Image 1	2	09	Archetypes/09	["https://plaumondpicture.s3.eu-west-3.amazonaws.com/Archetypes/09/01.jpg"]	\N	2025-04-16 18:03:57.633	2025-04-16 18:03:57.633
110	Outreconscience - Image 2	2	09	Archetypes/09	["https://plaumondpicture.s3.eu-west-3.amazonaws.com/Archetypes/09/02.jpg"]	\N	2025-04-16 18:03:57.635	2025-04-16 18:03:57.635
111	Outreconscience - Image 3	2	09	Archetypes/09	["https://plaumondpicture.s3.eu-west-3.amazonaws.com/Archetypes/09/03.jpg"]	\N	2025-04-16 18:03:57.636	2025-04-16 18:03:57.636
112	Outreconscience - Image 4	2	09	Archetypes/09	["https://plaumondpicture.s3.eu-west-3.amazonaws.com/Archetypes/09/04.jpg"]	\N	2025-04-16 18:03:57.642	2025-04-16 18:03:57.642
113	Outreconscience - Image 5	2	09	Archetypes/09	["https://plaumondpicture.s3.eu-west-3.amazonaws.com/Archetypes/09/05.jpg"]	\N	2025-04-16 18:03:57.654	2025-04-16 18:03:57.654
114	Concordance Universelle - 2022 - Image 1	3	00	Deployments/00	["https://plaumondpicture.s3.eu-west-3.amazonaws.com/Deployments/00/01.jpg"]	\N	2025-04-16 18:03:57.67	2025-04-16 18:03:57.67
115	Concordance Universelle - 2022 - Image 2	3	00	Deployments/00	["https://plaumondpicture.s3.eu-west-3.amazonaws.com/Deployments/00/02.jpg"]	\N	2025-04-16 18:03:57.673	2025-04-16 18:03:57.673
116	Concordance Universelle - 2022 - Image 3	3	00	Deployments/00	["https://plaumondpicture.s3.eu-west-3.amazonaws.com/Deployments/00/03.jpg"]	\N	2025-04-16 18:03:57.677	2025-04-16 18:03:57.677
117	Concordance Universelle - 2022 - Image 4	3	00	Deployments/00	["https://plaumondpicture.s3.eu-west-3.amazonaws.com/Deployments/00/04.jpg"]	\N	2025-04-16 18:03:57.68	2025-04-16 18:03:57.68
118	Concordance Universelle - 2022 - Image 5	3	00	Deployments/00	["https://plaumondpicture.s3.eu-west-3.amazonaws.com/Deployments/00/05.jpg"]	\N	2025-04-16 18:03:57.684	2025-04-16 18:03:57.684
119	L'Extension De La Pensée, L.28P - Saint Anastase - Paris - Image 1	3	01	Deployments/01	["https://plaumondpicture.s3.eu-west-3.amazonaws.com/Deployments/01/01.jpg"]	\N	2025-04-16 18:03:57.689	2025-04-16 18:03:57.689
120	L'Extension De La Pensée, L.28P - Saint Anastase - Paris - Image 2	3	01	Deployments/01	["https://plaumondpicture.s3.eu-west-3.amazonaws.com/Deployments/01/02.jpg"]	\N	2025-04-16 18:03:57.691	2025-04-16 18:03:57.691
121	L'Extension De La Pensée, L.28P - Saint Anastase - Paris - Image 3	3	01	Deployments/01	["https://plaumondpicture.s3.eu-west-3.amazonaws.com/Deployments/01/03.jpg"]	\N	2025-04-16 18:03:57.692	2025-04-16 18:03:57.692
122	L'Extension De La Pensée, L.28P - Saint Anastase - Paris - Image 4	3	01	Deployments/01	["https://plaumondpicture.s3.eu-west-3.amazonaws.com/Deployments/01/04.jpg"]	\N	2025-04-16 18:03:57.693	2025-04-16 18:03:57.693
123	Le Portant "524C" - Espace Commines - Paris - Image 1	3	02	Deployments/02	["https://plaumondpicture.s3.eu-west-3.amazonaws.com/Deployments/02/01.jpg"]	\N	2025-04-16 18:03:57.694	2025-04-16 18:03:57.694
124	Le Portant "524C" - Espace Commines - Paris - Image 2	3	02	Deployments/02	["https://plaumondpicture.s3.eu-west-3.amazonaws.com/Deployments/02/02.jpg"]	\N	2025-04-16 18:03:57.696	2025-04-16 18:03:57.696
125	Le Portant "524C" - Espace Commines - Paris - Image 3	3	02	Deployments/02	["https://plaumondpicture.s3.eu-west-3.amazonaws.com/Deployments/02/03.jpg"]	\N	2025-04-16 18:03:57.697	2025-04-16 18:03:57.697
126	Le Portant "524C" - Espace Commines - Paris - Image 4	3	02	Deployments/02	["https://plaumondpicture.s3.eu-west-3.amazonaws.com/Deployments/02/04.jpg"]	\N	2025-04-16 18:03:57.698	2025-04-16 18:03:57.698
127	Le Portant "524C" - Espace Commines - Paris - Image 5	3	02	Deployments/02	["https://plaumondpicture.s3.eu-west-3.amazonaws.com/Deployments/02/05.jpg"]	\N	2025-04-16 18:03:57.699	2025-04-16 18:03:57.699
128	Mutation De La Pensée Globale Et La Projection De La Protection - PYO Gallery LA - Los Angeles - Image 1	3	03	Deployments/03	["https://plaumondpicture.s3.eu-west-3.amazonaws.com/Deployments/03/01.jpg"]	\N	2025-04-16 18:03:57.708	2025-04-16 18:03:57.708
129	Mutation De La Pensée Globale Et La Projection De La Protection - PYO Gallery LA - Los Angeles - Image 2	3	03	Deployments/03	["https://plaumondpicture.s3.eu-west-3.amazonaws.com/Deployments/03/02.jpg"]	\N	2025-04-16 18:03:57.724	2025-04-16 18:03:57.724
130	Mutation De La Pensée Globale Et La Projection De La Protection - PYO Gallery LA - Los Angeles - Image 3	3	03	Deployments/03	["https://plaumondpicture.s3.eu-west-3.amazonaws.com/Deployments/03/03.jpg"]	\N	2025-04-16 18:03:57.727	2025-04-16 18:03:57.727
131	Mutation De La Pensée Globale Et La Projection De La Protection - PYO Gallery LA - Los Angeles - Image 4	3	03	Deployments/03	["https://plaumondpicture.s3.eu-west-3.amazonaws.com/Deployments/03/04.jpg"]	\N	2025-04-16 18:03:57.847	2025-04-16 18:03:57.847
132	L'Equilibre Du Présent - Collection Privée - Image 1	3	04	Deployments/04	["https://plaumondpicture.s3.eu-west-3.amazonaws.com/Deployments/04/01.jpg"]	\N	2025-04-16 18:03:57.859	2025-04-16 18:03:57.859
133	L'Equilibre Du Présent - Collection Privée - Image 2	3	04	Deployments/04	["https://plaumondpicture.s3.eu-west-3.amazonaws.com/Deployments/04/02.jpg"]	\N	2025-04-16 18:03:57.861	2025-04-16 18:03:57.861
134	L'Equilibre Du Présent - Collection Privée - Image 3	3	04	Deployments/04	["https://plaumondpicture.s3.eu-west-3.amazonaws.com/Deployments/04/03.jpg"]	\N	2025-04-16 18:03:57.866	2025-04-16 18:03:57.866
135	L'Equilibre Du Présent - Collection Privée - Image 4	3	04	Deployments/04	["https://plaumondpicture.s3.eu-west-3.amazonaws.com/Deployments/04/04.jpg"]	\N	2025-04-16 18:03:57.87	2025-04-16 18:03:57.87
136	L'Equilibre Du Présent - Collection Privée - Image 5	3	04	Deployments/04	["https://plaumondpicture.s3.eu-west-3.amazonaws.com/Deployments/04/05.jpg"]	\N	2025-04-16 18:03:57.873	2025-04-16 18:03:57.873
137	Intéraction Quantique - Galerie Du Théatre De La Ville - Brive - Image 1	3	05	Deployments/05	["https://plaumondpicture.s3.eu-west-3.amazonaws.com/Deployments/05/01.jpg"]	\N	2025-04-16 18:03:57.878	2025-04-16 18:03:57.878
138	Intéraction Quantique - Galerie Du Théatre De La Ville - Brive - Image 2	3	05	Deployments/05	["https://plaumondpicture.s3.eu-west-3.amazonaws.com/Deployments/05/02.jpg"]	\N	2025-04-16 18:03:57.879	2025-04-16 18:03:57.879
139	Intéraction Quantique - Galerie Du Théatre De La Ville - Brive - Image 3	3	05	Deployments/05	["https://plaumondpicture.s3.eu-west-3.amazonaws.com/Deployments/05/03.jpg"]	\N	2025-04-16 18:03:57.881	2025-04-16 18:03:57.881
140	Intéraction Quantique - Galerie Du Théatre De La Ville - Brive - Image 4	3	05	Deployments/05	["https://plaumondpicture.s3.eu-west-3.amazonaws.com/Deployments/05/04.jpg"]	\N	2025-04-16 18:03:57.882	2025-04-16 18:03:57.882
141	Etudes Préparatoires I - Image 1	4	01	Drawings/01	["https://plaumondpicture.s3.eu-west-3.amazonaws.com/Drawings/01/01.jpg"]	\N	2025-04-16 18:03:57.884	2025-04-16 18:03:57.884
142	Etudes Préparatoires I - Image 2	4	01	Drawings/01	["https://plaumondpicture.s3.eu-west-3.amazonaws.com/Drawings/01/02.jpg"]	\N	2025-04-16 18:03:57.886	2025-04-16 18:03:57.886
143	Etudes Préparatoires I - Image 3	4	01	Drawings/01	["https://plaumondpicture.s3.eu-west-3.amazonaws.com/Drawings/01/03.jpg"]	\N	2025-04-16 18:03:57.891	2025-04-16 18:03:57.891
144	Etudes Préparatoires I - Image 4	4	01	Drawings/01	["https://plaumondpicture.s3.eu-west-3.amazonaws.com/Drawings/01/04.jpg"]	\N	2025-04-16 18:03:57.892	2025-04-16 18:03:57.892
145	Etudes Préparatoires I - Image 5	4	01	Drawings/01	["https://plaumondpicture.s3.eu-west-3.amazonaws.com/Drawings/01/05.jpg"]	\N	2025-04-16 18:03:57.893	2025-04-16 18:03:57.893
146	Etude Préparatoire Sur L'Instantanéité - Image 1	4	02	Drawings/02	["https://plaumondpicture.s3.eu-west-3.amazonaws.com/Drawings/02/01.jpg"]	\N	2025-04-16 18:03:57.895	2025-04-16 18:03:57.895
147	Etude Préparatoire Sur L'Instantanéité - Image 2	4	02	Drawings/02	["https://plaumondpicture.s3.eu-west-3.amazonaws.com/Drawings/02/02.jpg"]	\N	2025-04-16 18:03:57.896	2025-04-16 18:03:57.896
148	Etude Préparatoire Sur L'Instantanéité - Image 3	4	02	Drawings/02	["https://plaumondpicture.s3.eu-west-3.amazonaws.com/Drawings/02/03.jpg"]	\N	2025-04-16 18:03:57.897	2025-04-16 18:03:57.897
149	Etude Préparatoire Sur L'Instantanéité - Image 4	4	02	Drawings/02	["https://plaumondpicture.s3.eu-west-3.amazonaws.com/Drawings/02/04.jpg"]	\N	2025-04-16 18:03:57.898	2025-04-16 18:03:57.898
150	Etudes Préparatoires II - Image 1	4	03	Drawings/03	["https://plaumondpicture.s3.eu-west-3.amazonaws.com/Drawings/03/01.jpg"]	\N	2025-04-16 18:03:57.899	2025-04-16 18:03:57.899
151	Etudes Préparatoires II - Image 2	4	03	Drawings/03	["https://plaumondpicture.s3.eu-west-3.amazonaws.com/Drawings/03/02.jpg"]	\N	2025-04-16 18:03:57.901	2025-04-16 18:03:57.901
152	Etudes Préparatoires II - Image 3	4	03	Drawings/03	["https://plaumondpicture.s3.eu-west-3.amazonaws.com/Drawings/03/03.jpg"]	\N	2025-04-16 18:03:57.902	2025-04-16 18:03:57.902
153	Etudes Préparatoires II - Image 4	4	03	Drawings/03	["https://plaumondpicture.s3.eu-west-3.amazonaws.com/Drawings/03/04.jpg"]	\N	2025-04-16 18:03:57.904	2025-04-16 18:03:57.904
154	Etudes Préparatoires II - Image 5	4	03	Drawings/03	["https://plaumondpicture.s3.eu-west-3.amazonaws.com/Drawings/03/05.jpg"]	\N	2025-04-16 18:03:57.906	2025-04-16 18:03:57.906
155	Etude Préparatoire Sur La Perception Des Interactions De L'infiniment Grand Et De L'Infiniment Petit - Image 1	4	04	Drawings/04	["https://plaumondpicture.s3.eu-west-3.amazonaws.com/Drawings/04/01.jpg"]	\N	2025-04-16 18:03:57.909	2025-04-16 18:03:57.909
156	Etude Préparatoire Sur La Perception Des Interactions De L'infiniment Grand Et De L'Infiniment Petit - Image 2	4	04	Drawings/04	["https://plaumondpicture.s3.eu-west-3.amazonaws.com/Drawings/04/02.jpg"]	\N	2025-04-16 18:03:57.91	2025-04-16 18:03:57.91
157	Etude Préparatoire Sur La Perception Des Interactions De L'infiniment Grand Et De L'Infiniment Petit - Image 3	4	04	Drawings/04	["https://plaumondpicture.s3.eu-west-3.amazonaws.com/Drawings/04/03.jpg"]	\N	2025-04-16 18:03:57.911	2025-04-16 18:03:57.911
158	Etude Préparatoire Sur La Perception Des Interactions De L'infiniment Grand Et De L'Infiniment Petit - Image 4	4	04	Drawings/04	["https://plaumondpicture.s3.eu-west-3.amazonaws.com/Drawings/04/04.jpg"]	\N	2025-04-16 18:03:57.912	2025-04-16 18:03:57.912
159	Etude Préparatoire De La Genèse De Pensée Du MétaHisme - Interaction Des Etats Superposés - Image 1	4	05	Drawings/05	["https://plaumondpicture.s3.eu-west-3.amazonaws.com/Drawings/05/01.jpg"]	\N	2025-04-16 18:03:57.913	2025-04-16 18:03:57.913
160	Etude Préparatoire De La Genèse De Pensée Du MétaHisme - Interaction Des Etats Superposés - Image 2	4	05	Drawings/05	["https://plaumondpicture.s3.eu-west-3.amazonaws.com/Drawings/05/02.jpg"]	\N	2025-04-16 18:03:57.917	2025-04-16 18:03:57.917
161	Etude Préparatoire De La Genèse De Pensée Du MétaHisme - Interaction Des Etats Superposés - Image 3	4	05	Drawings/05	["https://plaumondpicture.s3.eu-west-3.amazonaws.com/Drawings/05/03.jpg"]	\N	2025-04-16 18:03:57.918	2025-04-16 18:03:57.918
162	Etude Préparatoire De La Genèse De Pensée Du MétaHisme - Interaction Des Etats Superposés - Image 4	4	05	Drawings/05	["https://plaumondpicture.s3.eu-west-3.amazonaws.com/Drawings/05/04.jpg"]	\N	2025-04-16 18:03:57.92	2025-04-16 18:03:57.92
163	Etude Préparatoire De La Genèse De Pensée Du MétaHisme - Interaction Des Etats Superposés - Image 5	4	05	Drawings/05	["https://plaumondpicture.s3.eu-west-3.amazonaws.com/Drawings/05/05.jpg"]	\N	2025-04-16 18:03:57.921	2025-04-16 18:03:57.921
\.


--
-- Data for Name: Category; Type: TABLE DATA; Schema: public; Owner: paulo
--

COPY public."Category" (id, name, path, "createdAt", "updatedAt") FROM stdin;
1	transcriptions	images/transcriptions	2025-04-16 18:03:57.35	2025-04-16 18:03:57.35
2	archetype	images/archetype	2025-04-16 18:03:57.537	2025-04-16 18:03:57.537
3	deploiement	images/deploiement	2025-04-16 18:03:57.667	2025-04-16 18:03:57.667
4	drawing	images/drawing	2025-04-16 18:03:57.884	2025-04-16 18:03:57.884
\.


--
-- Data for Name: User; Type: TABLE DATA; Schema: public; Owner: paulo
--

COPY public."User" (id, username, password, "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: _prisma_migrations; Type: TABLE DATA; Schema: public; Owner: paulo
--

COPY public._prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count) FROM stdin;
610174b7-b561-4be4-bfd9-b94b043d8402	7ea32e02bf37e39df6c988c3dfa9edd22d8f9aaf5bfd4b09d31cff983f92cd0c	2025-04-16 20:03:41.367515+02	20250416175037_init	\N	\N	2025-04-16 20:03:41.32528+02	1
\.


--
-- Name: Artwork_id_seq; Type: SEQUENCE SET; Schema: public; Owner: paulo
--

SELECT pg_catalog.setval('public."Artwork_id_seq"', 163, true);


--
-- Name: Category_id_seq; Type: SEQUENCE SET; Schema: public; Owner: paulo
--

SELECT pg_catalog.setval('public."Category_id_seq"', 4, true);


--
-- Name: User_id_seq; Type: SEQUENCE SET; Schema: public; Owner: paulo
--

SELECT pg_catalog.setval('public."User_id_seq"', 1, false);


--
-- Name: Artwork Artwork_pkey; Type: CONSTRAINT; Schema: public; Owner: paulo
--

ALTER TABLE ONLY public."Artwork"
    ADD CONSTRAINT "Artwork_pkey" PRIMARY KEY (id);


--
-- Name: Category Category_pkey; Type: CONSTRAINT; Schema: public; Owner: paulo
--

ALTER TABLE ONLY public."Category"
    ADD CONSTRAINT "Category_pkey" PRIMARY KEY (id);


--
-- Name: User User_pkey; Type: CONSTRAINT; Schema: public; Owner: paulo
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_pkey" PRIMARY KEY (id);


--
-- Name: _prisma_migrations _prisma_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: paulo
--

ALTER TABLE ONLY public._prisma_migrations
    ADD CONSTRAINT _prisma_migrations_pkey PRIMARY KEY (id);


--
-- Name: Artwork_categoryId_idx; Type: INDEX; Schema: public; Owner: paulo
--

CREATE INDEX "Artwork_categoryId_idx" ON public."Artwork" USING btree ("categoryId");


--
-- Name: Artwork_title_categoryId_key; Type: INDEX; Schema: public; Owner: paulo
--

CREATE UNIQUE INDEX "Artwork_title_categoryId_key" ON public."Artwork" USING btree (title, "categoryId");


--
-- Name: Artwork_title_idx; Type: INDEX; Schema: public; Owner: paulo
--

CREATE INDEX "Artwork_title_idx" ON public."Artwork" USING btree (title);


--
-- Name: Category_name_key; Type: INDEX; Schema: public; Owner: paulo
--

CREATE UNIQUE INDEX "Category_name_key" ON public."Category" USING btree (name);


--
-- Name: User_username_key; Type: INDEX; Schema: public; Owner: paulo
--

CREATE UNIQUE INDEX "User_username_key" ON public."User" USING btree (username);


--
-- Name: Artwork Artwork_categoryId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: paulo
--

ALTER TABLE ONLY public."Artwork"
    ADD CONSTRAINT "Artwork_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES public."Category"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- PostgreSQL database dump complete
--

