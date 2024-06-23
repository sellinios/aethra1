--
-- PostgreSQL database dump
--

-- Dumped from database version 16.3 (Ubuntu 16.3-1.pgdg24.04+1)
-- Dumped by pg_dump version 16.3 (Ubuntu 16.3-1.pgdg24.04+1)

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
-- Data for Name: geography_geographiccategory; Type: TABLE DATA; Schema: public; Owner: sellinios
--

COPY public.geography_geographiccategory (id, name, slug) FROM stdin;
1	Place	place
2	Mountain	mountain
\.


--
-- Data for Name: geography_geographicdivision; Type: TABLE DATA; Schema: public; Owner: sellinios
--

COPY public.geography_geographicdivision (id, name, slug, level_name, parent_id) FROM stdin;
2	Europe	europe	Continent	\N
3	Greece	greece	Country	2
4	Attica	attica	Region	3
1	Municipality of Vyronas	municipality-of-vyronas	Municipality	4
5	Municipality of Glyfada	municipality-of-glyfada	Municipality	4
6	Municipality of Athens	municipality-of-athens	Municipality	4
7	Central Macedonia	central-macedonia	Region	3
8	Municipality of Dion Olympos	municipality-of-dion-olympos	Municipality	7
9	Peloponnese	peloponnese	Region	3
10	Municipality of Patras	municipality-of-patras	Municipality	9
11	Municipality of Thessaloniki	municipality-of-thessaloniki	Municipality	7
\.


--
-- Data for Name: geography_geographicplace; Type: TABLE DATA; Schema: public; Owner: sellinios
--

COPY public.geography_geographicplace (id, longitude, latitude, elevation, confirmed, location, admin_division_id, category_id) FROM stdin;
1	23.751301	37.959333	0	t	0101000020E6100000BD73284355C037409E7C7A6CCBFA4240	1	1
2	23.727539	37.983811	0	t	0101000020E61000008690F3FE3FBA3740F838D384EDFD4240	6	1
3	23.755045	37.865044	0	t	0101000020E610000021020EA14AC13740EECC04C3B9EE4240	5	1
5	21.734444	38.244444	0	t	0101000020E610000051BEA08504BC35400ADAE4F0491F4340	10	1
6	22.947412	40.629269	0	t	0101000020E610000084D6C39789F236407DB1F7E28B504440	11	1
4	22.358521	40.085567	2917	t	0101000020E6100000E1ED4108C85B3640F44E05DCF30A4440	8	2
\.


--
-- Data for Name: geography_geographicplace_translation; Type: TABLE DATA; Schema: public; Owner: sellinios
--

COPY public.geography_geographicplace_translation (id, language_code, name, slug, master_id) FROM stdin;
1	el	Βύρωνας	vyronas	1
4	el	Αθήνα	athens	2
6	el	Γλυφάδα	glyfada	3
7	el	Όλυμπος	olympus	4
8	el	Πάτρα	patra	5
14	en	Vyronas	vyronas	1
15	en	Athens	athens	2
16	en	Glyfada	glyfada	3
17	en	Olympus	olympus	4
18	en	Patra	patra	5
19	el	Θεσσαλονίκη	thessaloniki	6
20	en	Thessaloniki	thessaloniki	6
\.


--
-- Name: geography_geographiccategory_id_seq; Type: SEQUENCE SET; Schema: public; Owner: sellinios
--

SELECT pg_catalog.setval('public.geography_geographiccategory_id_seq', 2, true);


--
-- Name: geography_geographicdivision_id_seq; Type: SEQUENCE SET; Schema: public; Owner: sellinios
--

SELECT pg_catalog.setval('public.geography_geographicdivision_id_seq', 11, true);


--
-- Name: geography_geographicplace_id_seq; Type: SEQUENCE SET; Schema: public; Owner: sellinios
--

SELECT pg_catalog.setval('public.geography_geographicplace_id_seq', 6, true);


--
-- Name: geography_geographicplace_translation_id_seq; Type: SEQUENCE SET; Schema: public; Owner: sellinios
--

SELECT pg_catalog.setval('public.geography_geographicplace_translation_id_seq', 20, true);


--
-- PostgreSQL database dump complete
--

