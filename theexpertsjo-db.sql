--
-- PostgreSQL database dump
--

\restrict tt93mOwszhADVBCIxo299Qqrv1gPMouF53CwdMR7ARdfd7z4MhriGre9POUXGMW

-- Dumped from database version 16.10
-- Dumped by pg_dump version 16.10

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
-- Name: drizzle; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA drizzle;


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: __drizzle_migrations; Type: TABLE; Schema: drizzle; Owner: -
--

CREATE TABLE drizzle.__drizzle_migrations (
    id integer NOT NULL,
    hash text NOT NULL,
    created_at bigint
);


--
-- Name: __drizzle_migrations_id_seq; Type: SEQUENCE; Schema: drizzle; Owner: -
--

CREATE SEQUENCE drizzle.__drizzle_migrations_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: __drizzle_migrations_id_seq; Type: SEQUENCE OWNED BY; Schema: drizzle; Owner: -
--

ALTER SEQUENCE drizzle.__drizzle_migrations_id_seq OWNED BY drizzle.__drizzle_migrations.id;


--
-- Name: brands; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.brands (
    id integer NOT NULL,
    name text NOT NULL,
    image_url text NOT NULL,
    sort_order integer NOT NULL
);


--
-- Name: brands_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.brands_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: brands_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.brands_id_seq OWNED BY public.brands.id;


--
-- Name: brands_sort_order_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.brands_sort_order_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: brands_sort_order_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.brands_sort_order_seq OWNED BY public.brands.sort_order;


--
-- Name: categories; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.categories (
    id integer NOT NULL,
    name_en text NOT NULL,
    name_ar text DEFAULT ''::text NOT NULL,
    slug text NOT NULL,
    image_url text DEFAULT ''::text NOT NULL,
    sort_order integer DEFAULT 0 NOT NULL,
    visible boolean DEFAULT true NOT NULL,
    visibility text DEFAULT 'both'::text NOT NULL
);


--
-- Name: categories_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.categories_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: categories_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.categories_id_seq OWNED BY public.categories.id;


--
-- Name: clients; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.clients (
    id integer NOT NULL,
    name text NOT NULL,
    image_url text NOT NULL,
    sort_order integer NOT NULL
);


--
-- Name: clients_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.clients_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: clients_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.clients_id_seq OWNED BY public.clients.id;


--
-- Name: clients_sort_order_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.clients_sort_order_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: clients_sort_order_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.clients_sort_order_seq OWNED BY public.clients.sort_order;


--
-- Name: contact_messages; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.contact_messages (
    id integer NOT NULL,
    name text NOT NULL,
    email text NOT NULL,
    subject text DEFAULT ''::text NOT NULL,
    message text NOT NULL,
    read boolean DEFAULT false NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    deleted_at timestamp without time zone
);


--
-- Name: contact_messages_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.contact_messages_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: contact_messages_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.contact_messages_id_seq OWNED BY public.contact_messages.id;


--
-- Name: key_contacts; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.key_contacts (
    id integer NOT NULL,
    name_en text NOT NULL,
    name_ar text DEFAULT ''::text NOT NULL,
    role_en text NOT NULL,
    role_ar text DEFAULT ''::text NOT NULL,
    phone text DEFAULT ''::text NOT NULL,
    email text DEFAULT ''::text NOT NULL,
    image_url text DEFAULT ''::text NOT NULL,
    sort_order integer DEFAULT 0 NOT NULL,
    visible boolean DEFAULT true NOT NULL
);


--
-- Name: key_contacts_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.key_contacts_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: key_contacts_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.key_contacts_id_seq OWNED BY public.key_contacts.id;


--
-- Name: leadership; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.leadership (
    id integer NOT NULL,
    name_en text NOT NULL,
    name_ar text DEFAULT ''::text NOT NULL,
    role_en text NOT NULL,
    role_ar text DEFAULT ''::text NOT NULL,
    image_url text DEFAULT ''::text NOT NULL,
    sort_order integer DEFAULT 0 NOT NULL,
    phone text DEFAULT ''::text NOT NULL,
    email text DEFAULT ''::text NOT NULL,
    visible boolean DEFAULT true NOT NULL
);


--
-- Name: leadership_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.leadership_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: leadership_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.leadership_id_seq OWNED BY public.leadership.id;


--
-- Name: page_views; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.page_views (
    id integer NOT NULL,
    session_id text NOT NULL,
    path text NOT NULL,
    referrer text DEFAULT ''::text NOT NULL,
    user_agent text DEFAULT ''::text NOT NULL,
    device text DEFAULT 'desktop'::text NOT NULL,
    browser text DEFAULT ''::text NOT NULL,
    os text DEFAULT ''::text NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    country text DEFAULT ''::text NOT NULL,
    city text DEFAULT ''::text NOT NULL,
    screen_width integer,
    screen_height integer,
    language text DEFAULT ''::text NOT NULL,
    utm_source text DEFAULT ''::text NOT NULL,
    utm_medium text DEFAULT ''::text NOT NULL,
    utm_campaign text DEFAULT ''::text NOT NULL
);


--
-- Name: page_views_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.page_views_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: page_views_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.page_views_id_seq OWNED BY public.page_views.id;


--
-- Name: partners; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.partners (
    id integer NOT NULL,
    name text NOT NULL,
    image_url text NOT NULL,
    sort_order integer NOT NULL
);


--
-- Name: partners_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.partners_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: partners_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.partners_id_seq OWNED BY public.partners.id;


--
-- Name: partners_sort_order_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.partners_sort_order_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: partners_sort_order_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.partners_sort_order_seq OWNED BY public.partners.sort_order;


--
-- Name: product_images; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.product_images (
    id integer NOT NULL,
    product_id integer NOT NULL,
    image_url text NOT NULL,
    sort_order integer DEFAULT 0 NOT NULL
);


--
-- Name: product_images_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.product_images_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: product_images_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.product_images_id_seq OWNED BY public.product_images.id;


--
-- Name: products; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.products (
    id integer NOT NULL,
    name_en text NOT NULL,
    name_ar text DEFAULT ''::text NOT NULL,
    description_en text DEFAULT ''::text NOT NULL,
    description_ar text DEFAULT ''::text NOT NULL,
    image_url text DEFAULT ''::text NOT NULL,
    category_id integer NOT NULL,
    sort_order integer DEFAULT 0 NOT NULL,
    brand text DEFAULT ''::text NOT NULL,
    visible boolean DEFAULT true NOT NULL,
    visibility text DEFAULT 'both'::text NOT NULL
);


--
-- Name: products_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.products_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: products_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.products_id_seq OWNED BY public.products.id;


--
-- Name: quick_links; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.quick_links (
    id integer NOT NULL,
    label_en text NOT NULL,
    label_ar text DEFAULT ''::text NOT NULL,
    url text NOT NULL,
    sort_order integer DEFAULT 0 NOT NULL,
    visible boolean DEFAULT true NOT NULL
);


--
-- Name: quick_links_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.quick_links_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: quick_links_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.quick_links_id_seq OWNED BY public.quick_links.id;


--
-- Name: seo_settings; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.seo_settings (
    id integer NOT NULL,
    key text NOT NULL,
    value text DEFAULT ''::text NOT NULL
);


--
-- Name: seo_settings_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.seo_settings_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: seo_settings_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.seo_settings_id_seq OWNED BY public.seo_settings.id;


--
-- Name: session; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.session (
    sid character varying NOT NULL,
    sess json NOT NULL,
    expire timestamp(6) without time zone NOT NULL
);


--
-- Name: site_content; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.site_content (
    id integer NOT NULL,
    key text NOT NULL,
    value_en text DEFAULT ''::text NOT NULL,
    value_ar text DEFAULT ''::text NOT NULL
);


--
-- Name: site_content_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.site_content_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: site_content_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.site_content_id_seq OWNED BY public.site_content.id;


--
-- Name: site_images; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.site_images (
    id integer NOT NULL,
    key text NOT NULL,
    image_url text NOT NULL,
    label text DEFAULT ''::text NOT NULL
);


--
-- Name: site_images_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.site_images_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: site_images_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.site_images_id_seq OWNED BY public.site_images.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.users (
    id integer NOT NULL,
    username text NOT NULL,
    password text NOT NULL
);


--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: visitor_sessions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.visitor_sessions (
    id integer NOT NULL,
    session_id text NOT NULL,
    first_visit timestamp without time zone DEFAULT now() NOT NULL,
    last_visit timestamp without time zone DEFAULT now() NOT NULL,
    page_count integer DEFAULT 1 NOT NULL,
    device text DEFAULT 'desktop'::text NOT NULL,
    browser text DEFAULT ''::text NOT NULL,
    os text DEFAULT ''::text NOT NULL,
    referrer text DEFAULT ''::text NOT NULL,
    country text DEFAULT ''::text NOT NULL,
    city text DEFAULT ''::text NOT NULL,
    is_returning boolean DEFAULT false NOT NULL,
    landing_page text DEFAULT ''::text NOT NULL,
    exit_page text DEFAULT ''::text NOT NULL,
    duration integer DEFAULT 0 NOT NULL,
    language text DEFAULT ''::text NOT NULL
);


--
-- Name: visitor_sessions_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.visitor_sessions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: visitor_sessions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.visitor_sessions_id_seq OWNED BY public.visitor_sessions.id;


--
-- Name: __drizzle_migrations id; Type: DEFAULT; Schema: drizzle; Owner: -
--

ALTER TABLE ONLY drizzle.__drizzle_migrations ALTER COLUMN id SET DEFAULT nextval('drizzle.__drizzle_migrations_id_seq'::regclass);


--
-- Name: brands id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.brands ALTER COLUMN id SET DEFAULT nextval('public.brands_id_seq'::regclass);


--
-- Name: brands sort_order; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.brands ALTER COLUMN sort_order SET DEFAULT nextval('public.brands_sort_order_seq'::regclass);


--
-- Name: categories id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.categories ALTER COLUMN id SET DEFAULT nextval('public.categories_id_seq'::regclass);


--
-- Name: clients id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.clients ALTER COLUMN id SET DEFAULT nextval('public.clients_id_seq'::regclass);


--
-- Name: clients sort_order; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.clients ALTER COLUMN sort_order SET DEFAULT nextval('public.clients_sort_order_seq'::regclass);


--
-- Name: contact_messages id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.contact_messages ALTER COLUMN id SET DEFAULT nextval('public.contact_messages_id_seq'::regclass);


--
-- Name: key_contacts id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.key_contacts ALTER COLUMN id SET DEFAULT nextval('public.key_contacts_id_seq'::regclass);


--
-- Name: leadership id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.leadership ALTER COLUMN id SET DEFAULT nextval('public.leadership_id_seq'::regclass);


--
-- Name: page_views id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.page_views ALTER COLUMN id SET DEFAULT nextval('public.page_views_id_seq'::regclass);


--
-- Name: partners id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.partners ALTER COLUMN id SET DEFAULT nextval('public.partners_id_seq'::regclass);


--
-- Name: partners sort_order; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.partners ALTER COLUMN sort_order SET DEFAULT nextval('public.partners_sort_order_seq'::regclass);


--
-- Name: product_images id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.product_images ALTER COLUMN id SET DEFAULT nextval('public.product_images_id_seq'::regclass);


--
-- Name: products id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.products ALTER COLUMN id SET DEFAULT nextval('public.products_id_seq'::regclass);


--
-- Name: quick_links id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.quick_links ALTER COLUMN id SET DEFAULT nextval('public.quick_links_id_seq'::regclass);


--
-- Name: seo_settings id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.seo_settings ALTER COLUMN id SET DEFAULT nextval('public.seo_settings_id_seq'::regclass);


--
-- Name: site_content id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.site_content ALTER COLUMN id SET DEFAULT nextval('public.site_content_id_seq'::regclass);


--
-- Name: site_images id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.site_images ALTER COLUMN id SET DEFAULT nextval('public.site_images_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Name: visitor_sessions id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.visitor_sessions ALTER COLUMN id SET DEFAULT nextval('public.visitor_sessions_id_seq'::regclass);


--
-- Data for Name: __drizzle_migrations; Type: TABLE DATA; Schema: drizzle; Owner: -
--

COPY drizzle.__drizzle_migrations (id, hash, created_at) FROM stdin;
1	2019bc85e304b392bcd1736b6e68f0d157b956950ccc7d2fb7d7db46b54ba26d	1770811644307
\.


--
-- Data for Name: brands; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.brands (id, name, image_url, sort_order) FROM stdin;
\.


--
-- Data for Name: categories; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.categories (id, name_en, name_ar, slug, image_url, sort_order, visible, visibility) FROM stdin;
4	Amenities	المرافق	amenities	/uploads/1771534166034-457655711.png	4	t	both
3	Spa	السبا	spa	/uploads/1771534235493-421375478.png	3	t	both
2	Linens	البياضات	linens	/uploads/1771534255929-643057871.png	2	t	both
1	Room Service	خدمة الغرف	room-service	/uploads/cat-room-service.png	1	t	both
5	Food & Beverage	الأغذية والمشروبات	food-beverage		5	t	catalog
6	Buffet & Banqueting	البوفيه والمآدب	buffet-banqueting		6	t	catalog
7	Towels	المناشف	towels		7	t	catalog
8	Mini Bar & Safes	الميني بار والخزن	minibar		8	t	catalog
9	Housekeeping	التدبير الفندقي	housekeeping		9	t	catalog
10	Furniture	الأثاث	furniture		10	t	catalog
11	Banqueting	قاعات الاحتفالات	banqueting		11	t	catalog
\.


--
-- Data for Name: clients; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.clients (id, name, image_url, sort_order) FROM stdin;
83	Four Seasons	/uploads/four-seasons-new.png	1
84	Grand Hyatt	/uploads/grand-hyatt.jpg	2
85	W Hotel	/uploads/w-hotel.jpg	3
86	Landmark	/uploads/landmark.jpg	4
87	Coral Baghdad	/uploads/coral-baghdad.jpg	5
88	The House Hotels	/uploads/the-house-hotels-logo.webp	6
89	Banyan Tree	/uploads/banyan-tree.png	7
90	Rosewood	/uploads/rosewood.jpg	8
91	Mandarin Oriental	/uploads/mandarin-oriental.png	10
92	Accor	/uploads/accor.png	11
93	Le Meridien	/uploads/le-meridien.png	12
94	Crowne Plaza	/uploads/crowne-plaza.png	13
95	IHG	/uploads/ihg.jpg	14
96	Marriott	/uploads/marriott.png	15
97	Millennium	/uploads/millennium.png	16
98	Hyatt	/uploads/hyatt.jpg	17
99	WYNDHAM	/uploads/client-wyndham.webp	18
100	Estate Georgia	/uploads/client-estate-georgia.png	19
101	FIVE	/uploads/client-five.jpg	20
102	RAMADA	/uploads/client-ramada.jpg	21
103	IBIS	/uploads/client-ibis.jpeg	22
104	Bristol HOTEL	/uploads/client-bristol.png	23
105	HILTON	/uploads/client-hilton.svg	24
106	JIN JIANG	/uploads/client-jin-jiang.jpg	25
107	IL PALAZSO	/uploads/client-il-palazzo.jpg	26
108	Kempinski	/uploads/client-kempinski.jpg	27
109	RADISSON Collection	/uploads/client-radisson.jpg	28
\.


--
-- Data for Name: contact_messages; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.contact_messages (id, name, email, subject, message, read, created_at, deleted_at) FROM stdin;
6	bashar	bashar@albashitionlinesevices.com	test	test	t	2026-02-19 18:33:20.191085	\N
9	Test User	test@example.com	Test Email	This is a test message to verify email notifications are working.	t	2026-02-23 10:00:36.833935	\N
10	Reply Test User	replytest@example.com	Testing Reply Button	Please verify the Reply via Email button works correctly in the notification email.	f	2026-02-23 10:22:00.181991	\N
\.


--
-- Data for Name: key_contacts; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.key_contacts (id, name_en, name_ar, role_en, role_ar, phone, email, image_url, sort_order, visible) FROM stdin;
1	Alaa Abdin	علاء عابدين	General Manager	مدير عام	+962 79 5779345	alaa@theexpertsjo.com		1	t
2	Rafat Daood	رأفت داود	Sales Manager	مدير المبيعات	+962 79 0484745	sales@theexpertsjo.com		2	t
\.


--
-- Data for Name: leadership; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.leadership (id, name_en, name_ar, role_en, role_ar, image_url, sort_order, phone, email, visible) FROM stdin;
2	Rafat Daood	رأفت داود	Sales Manager	مدير المبيعات		2	+962 79 0484745	sales@theexpertsjo.com	t
1	Alaa Abdin	علاء عابدين	General Manager	مدير عام		1	+962 79 5779345	alaa@theexpertsjo.com	t
\.


--
-- Data for Name: page_views; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.page_views (id, session_id, path, referrer, user_agent, device, browser, os, created_at, country, city, screen_width, screen_height, language, utm_source, utm_medium, utm_campaign) FROM stdin;
1	npyarincm6mmewb7jr	/		Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36	desktop	Chrome	Linux	2026-03-06 12:53:38.706828			\N	\N				
2	mk693cw7vqmmewc3fr	/		Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36	desktop	Chrome	Linux	2026-03-06 12:54:20.051023			\N	\N				
3	mk693cw7vqmmewc3fr	/about		Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36	desktop	Chrome	Linux	2026-03-06 12:54:22.554933			\N	\N				
4	9um1un8wf1rmmex1xcj	/		Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36	desktop	Chrome	Linux	2026-03-06 13:14:25.279818			1280	720	en			
5	9um1un8wf1rmmex1xcj	/		Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36	desktop	Chrome	Linux	2026-03-06 13:15:01.49764			1280	720	en			
6	t05jrumkrmnmmex3qm3	/		Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) HeadlessChrome/140.0.0.0 Safari/537.36	desktop	Chrome	Linux	2026-03-06 13:15:49.774701			1280	720	en			
7	j3vyd8r6lcmmez0ix8	/	https://e24cf016-21c9-4399-a654-3af271d57383-00-1v79cq3jzy1t6.riker.replit.dev/admin	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36	desktop	Chrome	macOS	2026-03-06 14:09:19.514232			1440	900	en			
8	j3vyd8r6lcmmez0ix8	/room-service	https://e24cf016-21c9-4399-a654-3af271d57383-00-1v79cq3jzy1t6.riker.replit.dev/admin	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36	desktop	Chrome	macOS	2026-03-06 14:09:22.484339			1440	900	en			
9	j3vyd8r6lcmmez0ix8	/linens	https://e24cf016-21c9-4399-a654-3af271d57383-00-1v79cq3jzy1t6.riker.replit.dev/admin	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36	desktop	Chrome	macOS	2026-03-06 14:09:25.123599			1440	900	en			
10	j3vyd8r6lcmmez0ix8	/categories	https://e24cf016-21c9-4399-a654-3af271d57383-00-1v79cq3jzy1t6.riker.replit.dev/admin	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36	desktop	Chrome	macOS	2026-03-06 14:10:03.884864			1440	900	en			
11	j3vyd8r6lcmmez0ix8	/catalog	https://e24cf016-21c9-4399-a654-3af271d57383-00-1v79cq3jzy1t6.riker.replit.dev/admin	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36	desktop	Chrome	macOS	2026-03-06 14:10:08.336624			1440	900	en			
12	j3vyd8r6lcmmez0ix8	/catalog	https://e24cf016-21c9-4399-a654-3af271d57383-00-1v79cq3jzy1t6.riker.replit.dev/admin	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36	desktop	Chrome	macOS	2026-03-06 14:11:30.999227			1440	900	en			
13	j3vyd8r6lcmmez0ix8	/catalog	https://e24cf016-21c9-4399-a654-3af271d57383-00-1v79cq3jzy1t6.riker.replit.dev/admin	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36	desktop	Chrome	macOS	2026-03-06 14:14:08.794964			1440	900	en			
14	5ut89471ptbmmf7aehh	/		Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) HeadlessChrome/140.0.0.0 Safari/537.36	desktop	Chrome	Linux	2026-03-06 18:00:56.836512			1280	720	en			
15	bprf5bwfiyammf7c180	/		Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36	desktop	Chrome	Linux	2026-03-06 18:02:13.034947			400	720	en			
16	bgl8ztxinufmmf7dc8z	/		Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 Replit-Bonsai/2.170.0 (iOS 26.3)	mobile	Other	macOS	2026-03-06 18:03:14.275621			390	844	en			
17	bgl8ztxinufmmf7dc8z	/	https://e24cf016-21c9-4399-a654-3af271d57383-00-1v79cq3jzy1t6.riker.replit.dev/	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 Replit-Bonsai/2.170.0 (iOS 26.3)	mobile	Other	macOS	2026-03-06 18:04:43.316136			390	844	en			
18	bgl8ztxinufmmf7dc8z	/	https://e24cf016-21c9-4399-a654-3af271d57383-00-1v79cq3jzy1t6.riker.replit.dev/	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 Replit-Bonsai/2.170.0 (iOS 26.3)	mobile	Other	macOS	2026-03-06 18:05:10.611726			390	844	en			
19	q4fx473anpqmmf7g7ah	/		Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36	desktop	Chrome	Linux	2026-03-06 18:05:27.49224			400	720	en			
20	bgl8ztxinufmmf7dc8z	/	https://e24cf016-21c9-4399-a654-3af271d57383-00-1v79cq3jzy1t6.riker.replit.dev/	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 Replit-Bonsai/2.170.0 (iOS 26.3)	mobile	Other	macOS	2026-03-06 18:05:29.57321			390	844	en			
21	bgl8ztxinufmmf7dc8z	/	https://e24cf016-21c9-4399-a654-3af271d57383-00-1v79cq3jzy1t6.riker.replit.dev/	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 Replit-Bonsai/2.170.0 (iOS 26.3)	mobile	Other	macOS	2026-03-06 18:06:59.170341			390	844	en			
22	yzwef2dpxpommf7i6by	/	https://replit.com/	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 Replit-Bonsai/2.170.0 (iOS 26.3)	mobile	Other	macOS	2026-03-06 18:06:59.83207			390	844	en			
23	bgl8ztxinufmmf7dc8z	/	https://e24cf016-21c9-4399-a654-3af271d57383-00-1v79cq3jzy1t6.riker.replit.dev/	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 Replit-Bonsai/2.170.0 (iOS 26.3)	mobile	Other	macOS	2026-03-06 18:10:40.330153			390	844	en			
24	bgl8ztxinufmmf7dc8z	/	https://e24cf016-21c9-4399-a654-3af271d57383-00-1v79cq3jzy1t6.riker.replit.dev/	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 Replit-Bonsai/2.170.0 (iOS 26.3)	mobile	Other	macOS	2026-03-06 18:11:54.963738			390	844	en			
25	bgl8ztxinufmmf7dc8z	/	https://e24cf016-21c9-4399-a654-3af271d57383-00-1v79cq3jzy1t6.riker.replit.dev/admin	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 Replit-Bonsai/2.170.0 (iOS 26.3)	mobile	Other	macOS	2026-03-06 18:19:36.598115			390	844	en			
26	bgl8ztxinufmmf7dc8z	/	https://e24cf016-21c9-4399-a654-3af271d57383-00-1v79cq3jzy1t6.riker.replit.dev/admin	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 Replit-Bonsai/2.170.0 (iOS 26.3)	mobile	Other	macOS	2026-03-06 18:21:38.046109			390	844	en			
27	bgl8ztxinufmmf7dc8z	/catalog	https://e24cf016-21c9-4399-a654-3af271d57383-00-1v79cq3jzy1t6.riker.replit.dev/admin	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 Replit-Bonsai/2.170.0 (iOS 26.3)	mobile	Other	macOS	2026-03-06 18:22:03.683094			390	844	en			
28	2bkfxtgwczemmf829ks	/catalog		Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.3 Mobile/15E148 Safari/604.1	mobile	Safari	macOS	2026-03-06 18:22:37.019494			390	844	en			
29	bgl8ztxinufmmf7dc8z	/catalog	https://e24cf016-21c9-4399-a654-3af271d57383-00-1v79cq3jzy1t6.riker.replit.dev/catalog	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 Replit-Bonsai/2.170.0 (iOS 26.3)	mobile	Other	macOS	2026-03-06 18:23:47.537011			390	844	en			
30	bgl8ztxinufmmf7dc8z	/	https://e24cf016-21c9-4399-a654-3af271d57383-00-1v79cq3jzy1t6.riker.replit.dev/catalog	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 Replit-Bonsai/2.170.0 (iOS 26.3)	mobile	Other	macOS	2026-03-06 18:24:24.807615			390	844	en			
31	yzwef2dpxpommf7i6by	/	https://replit.com/	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 Replit-Bonsai/2.170.0 (iOS 26.3)	mobile	Other	macOS	2026-03-06 18:24:25.258042			390	844	en			
32	bgl8ztxinufmmf7dc8z	/catalog	https://e24cf016-21c9-4399-a654-3af271d57383-00-1v79cq3jzy1t6.riker.replit.dev/catalog	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 Replit-Bonsai/2.170.0 (iOS 26.3)	mobile	Other	macOS	2026-03-06 18:25:33.813803			390	844	en			
33	bgl8ztxinufmmf7dc8z	/catalog	https://e24cf016-21c9-4399-a654-3af271d57383-00-1v79cq3jzy1t6.riker.replit.dev/catalog	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 Replit-Bonsai/2.170.0 (iOS 26.3)	mobile	Other	macOS	2026-03-06 18:28:58.963752			390	844	en			
34	yzwef2dpxpommf7i6by	/catalog	https://replit.com/	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 Replit-Bonsai/2.170.0 (iOS 26.3)	mobile	Other	macOS	2026-03-06 18:33:47.321195			390	844	en			
35	bgl8ztxinufmmf7dc8z	/catalog	https://e24cf016-21c9-4399-a654-3af271d57383-00-1v79cq3jzy1t6.riker.replit.dev/catalog	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 Replit-Bonsai/2.170.0 (iOS 26.3)	mobile	Other	macOS	2026-03-06 18:33:47.348781			390	844	en			
36	0m0uw1lz7s5mmf8gndn	/		Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) HeadlessChrome/140.0.0.0 Safari/537.36	desktop	Chrome	Linux	2026-03-06 18:33:47.87173			1280	720	en			
37	bgl8ztxinufmmf7dc8z	/catalog	https://e24cf016-21c9-4399-a654-3af271d57383-00-1v79cq3jzy1t6.riker.replit.dev/catalog	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 Replit-Bonsai/2.170.0 (iOS 26.3)	mobile	Other	macOS	2026-03-06 18:34:45.555916			390	844	en			
38	xwdqb2zhm5dmmg7h6d7	/		Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) HeadlessChrome/140.0.0.0 Safari/537.36	desktop	Chrome	Linux	2026-03-07 10:53:59.058293			1280	720	en			
39	juhl3kjzjasmoo23wn5	/	https://e24cf016-21c9-4399-a654-3af271d57383-00-1v79cq3jzy1t6.riker.replit.dev/__replco/workspace_iframe.html?initialPath=%2F&id=default-start-application	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	desktop	Chrome	macOS	2026-05-02 08:05:16.216289			1440	900	en			
\.


--
-- Data for Name: partners; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.partners (id, name, image_url, sort_order) FROM stdin;
28	Cashmere	/uploads/1771527276734-616247513.png	2
29	Abdeen	/uploads/1771527617893-918789395.png	3
\.


--
-- Data for Name: product_images; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.product_images (id, product_id, image_url, sort_order) FROM stdin;
3	43	/uploads/towel-gallery.png	1
\.


--
-- Data for Name: products; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.products (id, name_en, name_ar, description_en, description_ar, image_url, category_id, sort_order, brand, visible, visibility) FROM stdin;
3	Signature Thermal Carafe	دورق حراري مميز	Double-walled thermal carafe maintaining beverage temperature for hours, crafted with premium materials.	دورق حراري مزدوج الجدران يحافظ على حرارة المشروبات لساعات، مصنوع من مواد فاخرة.	/uploads/rs-carafe.png	1	2		t	both
4	Mirror-Finish Cloche	غطاء طعام بتشطيب مرآة	Handcrafted mirror-finish cloche for dramatic tableside reveals, elevating the guest dining experience.	غطاء طعام مصنوع يدوياً بتشطيب مرآة لكشف مثير عن الأطباق، يرتقي بتجربة ضيوف المطعم.	/uploads/rs-cloche.png	1	3		t	both
2	Elite Service Trolley	عربة خدمة الغرف الفاخرة	Premium stainless steel service trolley with mirror finish, designed for elegant in-room dining presentations.	عربة خدمة غرف من الفولاذ المقاوم للصدأ بتشطيب مرآة، مصممة لتقديم الطعام داخل الغرف بأناقة.	/uploads/rs-trolley.png	1	1		t	both
6	Luxury Duvet Cover	غطاء لحاف فاخر	Hotel-grade duvet cover crafted from long-staple cotton with elegant hemstitch detailing. Wrinkle-resistant and machine washable for effortless maintenance.	غطاء لحاف فندقي مصنوع من القطن طويل التيلة مع تفاصيل خياطة أنيقة. مقاوم للتجاعيد وقابل للغسل في الغسالة.	/uploads/prod-duvet-cover.png	2	2		t	both
5	Egyptian Cotton Bed Sheet Set	طقم ملاءات قطن مصري	Premium 600-thread-count Egyptian cotton bed sheets with sateen weave finish. Available in king, queen, and twin sizes with deep pocket fitted sheets.	ملاءات سرير من القطن المصري الفاخر بعدد 600 خيط مع تشطيب ساتان. متوفرة بمقاسات كينج وكوين وتوين.	/uploads/prod-egyptian-sheets.png	2	1		t	both
7	Sateen Pillowcase Collection	مجموعة أكياس وسائد ساتان	Silky-smooth sateen pillowcases with envelope closure design. Hypoallergenic and color-fast to maintain pristine appearance through hundreds of washes.	أكياس وسائد ساتان ناعمة كالحرير بتصميم إغلاق ظرف. مضادة للحساسية وثابتة اللون.	/uploads/prod-sateen-pillowcases.png	2	3		t	both
8	Aromatherapy Essential Oil Diffuser	موزع زيوت عطرية	Whisper-quiet ultrasonic diffuser with ambient LED lighting. Programmable timer and mist intensity settings for a customized spa atmosphere.	موزع بالموجات فوق الصوتية هادئ للغاية مع إضاءة LED محيطية. مؤقت قابل للبرمجة وإعدادات كثافة الرذاذ.	/uploads/prod-oil-diffuser.png	3	1		t	both
9	Heated Massage Stone Set	طقم أحجار تدليك ساخنة	Professional-grade basalt hot stones in a premium wooden presentation box. Retains heat for extended therapy sessions with uniform temperature distribution.	أحجار بازلت ساخنة بدرجة احترافية في صندوق خشبي فاخر. تحتفظ بالحرارة لجلسات علاج ممتدة.	/uploads/prod-massage-stones.png	3	2		t	both
10	Plush Spa Robe	روب سبا فاخر	Ultra-soft Turkish cotton spa robe with shawl collar and double-loop terry construction. Embroidery-ready for custom hotel branding.	روب سبا من القطن التركي فائق النعومة بياقة شال وبناء تيري مزدوج الحلقات. جاهز للتطريز بشعار الفندق.	/uploads/prod-spa-robe.png	3	3		t	both
12	Vanity Mirror with LED Ring	مرآة تجميل بإضاءة LED	Double-sided vanity mirror with 10x magnification and daylight LED ring. Touch-sensitive dimmer with memory function and USB charging port.	مرآة تجميل مزدوجة الجوانب بتكبير 10 أضعاف وإضاءة LED نهارية. مفتاح تعتيم لمسي مع ذاكرة ومنفذ شحن USB.	/uploads/prod-vanity-mirror.png	4	2		t	both
13	Leather Guest Directory	دليل الضيوف الجلدي	Hand-stitched genuine leather guest directory with gold-foil hotel logo debossing. Includes room service menu, spa guide, and local attractions inserts.	دليل ضيوف من الجلد الطبيعي مخيط يدوياً مع شعار الفندق بالذهب. يتضمن قائمة خدمة الغرف ودليل السبا.	/uploads/prod-guest-directory.png	4	3		t	both
15	Professional Chafing Dish	طبق تسخين احترافي	Full-size stainless steel chafing dish with hydraulic soft-close lid. Dual fuel holder design maintains consistent temperature for extended service periods.	طبق تسخين من الفولاذ المقاوم للصدأ بغطاء هيدروليكي. تصميم حامل وقود مزدوج يحافظ على درجة حرارة ثابتة.	/uploads/prod-chafing-dish.png	5	2		t	both
16	Artisan Coffee Service Set	طقم تقديم قهوة حرفي	Porcelain coffee pot, sugar bowl, and creamer set with 24K gold trim. Chip-resistant glaze ensures lasting elegance in high-traffic environments.	إبريق قهوة وسكرية وإبريق حليب من البورسلين بتشطيب ذهب عيار 24. طلاء مقاوم للكسر.	/uploads/prod-coffee-set.png	5	3		t	both
17	Marble-Top Buffet Station	محطة بوفيه بسطح رخامي	Modular buffet station with genuine Carrara marble top and brushed gold frame. Integrated sneeze guard and adjustable LED food lighting.	محطة بوفيه معيارية بسطح رخام كرارا الأصلي وإطار ذهبي مصقول. حاجز حماية متكامل وإضاءة LED.	/uploads/prod-buffet-station.png	6	1		t	both
18	Live Cooking Station	محطة طهي حي	Professional live cooking station with built-in induction cooktop and extraction hood. Tempered glass display panel and granite work surface.	محطة طهي حي احترافية مع موقد حث مدمج وشفاط. لوحة عرض زجاج مقسى وسطح عمل جرانيت.	/uploads/prod-cooking-station.png	6	2		t	both
19	Tiered Display Riser Set	مجموعة رافعات عرض متدرجة	Acrylic and brushed steel tiered risers for dramatic food presentation. Modular design allows countless configurations for desserts, appetizers, and more.	رافعات متدرجة من الأكريليك والفولاذ المصقول لعرض الطعام. تصميم معياري يسمح بتكوينات لا حصر لها.	/uploads/prod-display-risers.png	6	3		t	both
20	Zero-Twist Bath Towel	منشفة حمام زيرو تويست	Ultra-absorbent zero-twist cotton bath towel with reinforced dobby border. Exceptionally soft hand feel that improves with every wash cycle.	منشفة حمام من القطن زيرو تويست فائقة الامتصاص بحاشية دوبي معززة. ملمس ناعم استثنائي يتحسن مع كل غسلة.	/uploads/prod-bath-towel.png	7	1		t	both
21	Jacquard Hand Towel	منشفة يد جاكار	Elegant jacquard-woven hand towel with custom hotel monogram option. Quick-dry technology with lasting color vibrancy and shape retention.	منشفة يد منسوجة بتقنية الجاكار مع خيار شعار الفندق. تقنية جفاف سريع مع حيوية لون دائمة.	/uploads/prod-hand-towel.png	7	2		t	both
22	Pool & Beach Towel	منشفة مسبح وشاطئ	Oversized cabana-stripe pool towel in resort-inspired colors. Sand-resistant weave with UV-stable dyes for vibrant outdoor use season after season.	منشفة مسبح كبيرة بخطوط كابانا بألوان مستوحاة من المنتجعات. نسيج مقاوم للرمل بأصباغ ثابتة ضد الأشعة فوق البنفسجية.	/uploads/prod-pool-towel.png	7	3		t	both
24	Digital In-Room Safe	خزنة رقمية للغرف	Motorized digital safe with backlit keypad and emergency master override. Laptop-compatible interior with anti-tamper audit trail logging.	خزنة رقمية بمحرك مع لوحة مفاتيح مضيئة وتجاوز طوارئ رئيسي. داخل متوافق مع اللابتوب مع سجل مراجعة.	/uploads/prod-room-safe.png	8	2		t	both
25	Professional Housekeeping Cart	عربة تنظيف احترافية	Heavy-duty housekeeping cart with lockable cabinet, linen bags, and accessory caddy. Ergonomic push handle with quiet-roll rubber casters.	عربة تنظيف متينة بخزانة قابلة للقفل وأكياس مفروشات وحامل إكسسوارات. مقبض دفع مريح بعجلات مطاطية هادئة.	/uploads/prod-housekeeping-cart.png	9	1		t	both
26	Cordless Upright Vacuum	مكنسة كهربائية لاسلكية	Lightweight cordless vacuum with HEPA filtration and 60-minute runtime. Ultra-quiet motor ideal for occupied-room cleaning without disturbing guests.	مكنسة كهربائية لاسلكية خفيفة بفلتر HEPA ووقت تشغيل 60 دقيقة. محرك هادئ للغاية مثالي لتنظيف الغرف المشغولة.	/uploads/prod-vacuum.png	9	2		t	both
23	Silent Absorption Minibar	ميني بار صامت	Thermoelectric cooling minibar with zero-decibel operation. Adjustable shelving, interior LED lighting, and automatic defrost with A++ energy rating.	ميني بار بتبريد كهروحراري بدون صوت. أرفف قابلة للتعديل وإضاءة LED داخلية وإزالة الجليد التلقائية.	/uploads/prod-minibar.png	1	1		t	both
14	Crystal Glassware Collection	مجموعة أكواب كريستال	Lead-free crystal wine glasses, champagne flutes, and tumblers with laser-cut rims. Dishwasher safe with exceptional clarity and brilliance.	أكواب نبيذ وشمبانيا وتمبلر من الكريستال الخالي من الرصاص بحواف مقطوعة بالليزر. آمنة للغسالة.	/uploads/prod-crystal-glassware.png	5	1		t	both
27	Eco-Friendly Cleaning Kit	طقم تنظيف صديق للبيئة	Complete green cleaning kit with biodegradable solutions, microfiber cloths, and color-coded spray bottles. Certified eco-friendly formulations safe for all surfaces.	طقم تنظيف أخضر كامل بمحاليل قابلة للتحلل وأقمشة مايكروفايبر وزجاجات رش مرمزة بالألوان.	/uploads/prod-cleaning-kit.png	9	3		t	both
28	Executive Writing Desk	مكتب كتابة تنفيذي	Solid walnut writing desk with integrated wireless charging pad and concealed cable management. Soft-close drawer with leather-lined interior.	مكتب كتابة من خشب الجوز الصلب مع لوحة شحن لاسلكي متكاملة وإدارة كابلات مخفية. درج بإغلاق ناعم.	/uploads/prod-writing-desk.png	10	1		t	both
29	Upholstered Lounge Chair	كرسي استرخاء منجد	Italian-designed lounge chair with premium bouclé upholstery and solid oak legs. Fire-retardant fill meets international hospitality safety standards.	كرسي استرخاء بتصميم إيطالي بتنجيد بوكليه فاخر وأرجل بلوط صلب. حشوة مقاومة للحريق تلبي المعايير الدولية.	/uploads/prod-lounge-chair.png	10	2		t	both
30	Bedside Console Table	طاولة جانبية للسرير	Minimalist bedside table with touch-activated reading light and dual USB-C ports. Scratch-resistant lacquer finish with felt-lined storage compartment.	طاولة جانبية بتصميم بسيط مع إضاءة قراءة تعمل باللمس ومنفذي USB-C. تشطيب لاكيه مقاوم للخدش.	/uploads/prod-bedside-table.png	10	3		t	both
31	Stackable Banquet Chair	كرسي مأدبة قابل للتكديس	Commercial-grade banquet chair with ergonomic lumbar support and stain-resistant fabric. Stacks 10 high with protective bumpers for efficient storage.	كرسي مأدبة بدرجة تجارية مع دعم قطني مريح وقماش مقاوم للبقع. يتكدس 10 كراسي مع واقيات.	/uploads/prod-banquet-chair.png	11	1		t	both
32	Folding Banquet Table	طاولة مأدبة قابلة للطي	Heavy-duty folding banquet table with ABS blow-molded top and powder-coated steel frame. Seats 8 comfortably with gravity-lock folding legs.	طاولة مأدبة قابلة للطي متينة بسطح ABS وإطار فولاذ مطلي. تتسع لـ 8 أشخاص بأرجل قابلة للطي.	/uploads/prod-banquet-table.png	11	2		t	both
33	Portable Stage Platform	منصة مسرح متنقلة	Modular stage platform with adjustable height legs and non-slip carpet surface. Interlocking design creates seamless stages of any size for events.	منصة مسرح معيارية بأرجل قابلة لتعديل الارتفاع وسطح سجاد مانع للانزلاق. تصميم متشابك ينشئ مسارح بأي حجم.	/uploads/prod-stage-platform.png	11	3		t	both
11	Premium Guest Amenity Kit	طقم مستلزمات الضيوف الفاخر	Complete guest amenity set featuring shampoo, conditioner, body wash, and lotion in elegant refillable dispensers. Paraben-free botanical formulations.	طقم مستلزمات ضيوف كامل يضم شامبو وبلسم وغسول جسم ولوشن في موزعات أنيقة قابلة لإعادة التعبئة.	/uploads/prod-amenity-kit.png	4	1	ABDEEN	t	both
38	Luxury Bellman Luggage Cart	عربة حمل الأمتعة الفاخرة	Premium gold-finished bellman cart with elegant birdcage dome design. Features a plush red velvet platform, heavy-duty rubber wheels for smooth mobility, and a polished brass frame. Ideal for luxury hotel lobbies and five-star hospitality environments.	عربة حمل أمتعة فاخرة بتشطيب ذهبي مع تصميم قبة أنيق. تتميز بمنصة مخملية حمراء فاخرة وعجلات مطاطية متينة للتنقل السلس وإطار نحاسي مصقول. مثالية لبهو الفنادق الفاخرة وبيئات الضيافة من فئة الخمس نجوم.	/uploads/1772629138208-409604322.png	1	100		t	both
35	Premium Hospitality Tray Set	طقم صينية ضيافة فاخر	Complete in-room beverage service tray set featuring an elegant electric kettle, ceramic coffee cups, curated tea selections, and a natural wood serving tray. Designed to elevate the guest experience with refined hospitality.	طقم صينية ضيافة فاخر يتضمن غلاية كهربائية أنيقة وأكواب قهوة سيراميكية ومجموعة مختارة من الشاي وصينية تقديم خشبية طبيعية. مصمم لإثراء تجربة الضيوف بضيافة راقية.	/uploads/1772617048582-18340353.png	1	4		t	both
36	Luxury Executive Hospitality Tray Set	طقم صينية ضيافة تنفيذي فاخر	Premium executive-grade hospitality tray set crafted from dark walnut wood with polished brass accents. Features a brushed stainless steel gooseneck electric kettle, fine bone china espresso cups with gold rim detailing, and a leather-wrapped compartment for premium loose-leaf teas and artisan coffee capsules. Designed for luxury suites and VIP rooms.	طقم صينية ضيافة تنفيذي فاخر مصنوع من خشب الجوز الداكن مع لمسات نحاسية مصقولة. يتميز بغلاية كهربائية من الفولاذ المقاوم للصدأ المصقول وأكواب إسبريسو من البورسلين الفاخر بحواف ذهبية وحجرة مغلفة بالجلد للشاي الفاخر وكبسولات القهوة الحرفية. مصمم للأجنحة الفاخرة وغرف كبار الشخصيات.	/uploads/1772617295773-562546079.png	1	5		t	both
39	Eco-Friendly Guest Slippers	شباشب ضيوف صديقة للبيئة	Sustainable, plant-based guest slippers crafted from 100% biodegradable materials. Featuring a soft waffle-textured upper, comfortable non-slip sole, and elegant kraft paper eco-packaging. Less plastic, less carbon emissions — the perfect choice for environmentally conscious luxury hotels.	شباشب ضيوف مستدامة مصنوعة من مواد نباتية قابلة للتحلل بنسبة 100%. تتميز بسطح علوي ناعم بنسيج الوافل ونعل مريح مانع للانزلاق وتغليف أنيق من ورق الكرافت الصديق للبيئة. بلاستيك أقل وانبعاثات كربونية أقل — الخيار الأمثل للفنادق الفاخرة الواعية بيئياً.	/uploads/1772629711707-688683326.png	4	100		t	both
40	Table Linen Napkin	مناديل طاولة كتان	Premium quality table linen napkin in elegant pastel pink. Made from soft, durable fabric with a refined texture, perfect for fine dining settings and luxury hotel restaurants. Available in multiple colors to complement any table arrangement.	مناديل طاولة كتان فاخرة بلون وردي باستيل أنيق. مصنوعة من قماش ناعم ومتين بملمس راقٍ، مثالية لأماكن تناول الطعام الفاخرة ومطاعم الفنادق الراقية. متوفرة بألوان متعددة لتتناسب مع أي ترتيب طاولة.	/uploads/1772629982100-239022815.png	2	100		t	both
41	Chair Cover	غطاء كرسي	Premium spandex banquet chair covers available in a wide range of colors including white, grey, green, blue, navy, purple, and red. Stretchable fabric fits most standard banquet chairs with a sleek, wrinkle-free finish. Optional decorative sash bows available in gold, pink, and red for weddings and special events.	أغطية كراسي مآدب من السباندكس الفاخر متوفرة بمجموعة واسعة من الألوان تشمل الأبيض والرمادي والأخضر والأزرق والكحلي والبنفسجي والأحمر. قماش قابل للتمدد يناسب معظم كراسي المآدب القياسية بمظهر أنيق خالٍ من التجاعيد. أشرطة زينة اختيارية متوفرة بالذهبي والوردي والأحمر للأعراس والمناسبات الخاصة.	/uploads/1772630750428-844404319.png	2	110		t	both
42	Dual Compartment Waste Bin	سلة نفايات مزدوجة	Sleek dual-compartment waste bin with premium dark leather-textured finish. Designed for luxury hotel rooms, featuring two separate sections for waste sorting with discreet color-coded indicators. Compact rectangular design fits seamlessly beside desks and furniture.	سلة نفايات أنيقة بحجرتين مع تشطيب جلدي داكن فاخر. مصممة لغرف الفنادق الراقية، تتميز بقسمين منفصلين لفرز النفايات مع مؤشرات ملونة. تصميم مستطيل مدمج يتناسب بسلاسة بجانب المكاتب والأثاث.	/uploads/1772631158453-160062754.png	1	110		t	both
43	Hotel Bathroom Towel Set	طقم مناشف حمام الفندق	High quality luxury 100% cotton five star hotel bath towel set.\n\nCraft: Face towel, hand towel, bath towel, floor towel, morning/evening towel, beach towel\nMaterial: Cotton, looped pile fabric, velvet pile, imitation silk\nYarn: 16S, 21S, 32S\nSize: Customized size\nColor: Customized color\nFabric style: Modern or classic\nLogo: Embroidery or printing\nWeight: Customized\nMOQ: 300 PCS\nLead time: 20-40 days\nService: OEM or ODM\nPackage: Dustproof bag and woven bag	طقم مناشف حمام فندقي فاخر من القطن 100% بجودة خمس نجوم.\n\nالصناعة: منشفة وجه، منشفة يد، منشفة استحمام، منشفة أرضية، منشفة صباحية/مسائية، منشفة شاطئ\nالخامة: قطن، نسيج وبري حلقي، وبر مخملي، حرير صناعي\nالغزل: 16S، 21S، 32S\nالمقاس: حسب الطلب\nاللون: حسب الطلب\nنمط القماش: حديث أو كلاسيكي\nالشعار: تطريز أو طباعة\nالوزن: حسب الطلب\nالحد الأدنى للطلب: 300 قطعة\nمدة التسليم: 20-40 يوم\nالخدمة: OEM أو ODM\nالتغليف: كيس مقاوم للغبار وكيس منسوج	/uploads/towel-main.png	7	1		t	both
\.


--
-- Data for Name: quick_links; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.quick_links (id, label_en, label_ar, url, sort_order, visible) FROM stdin;
1	Home	الرئيسية	/	1	t
2	About Us	من نحن	/about-us	2	t
3	Products	المنتجات	/categories	3	t
4	Contact	اتصل بنا	/contact	4	t
6	Catalog	الكتالوج	/catalog	5	t
\.


--
-- Data for Name: seo_settings; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.seo_settings (id, key, value) FROM stdin;
74	org_name_ar	الخبراء
8	org_url	https://theexpertsjo.com
9	org_description	Elevating hospitality with premium supplies — where quality meets comfort for every guest experience.
77	org_description_ar	الارتقاء بالضيافة مع مستلزمات متميزة — حيث تلتقي الجودة بالراحة لكل تجربة ضيف.
10	org_phone	+962 79 0484745
11	sitemap_base_url	https://theexpertsjo.com
12	robots_allow_all	true
1	site_title	The Experts | Trusted Hospitality Supplier in Jordan
62	site_title_ar	الخبراء - لمستلزمات الفنادق 
2	site_description	Elevating hospitality with premium supplies — where quality meets comfort for every guest experience — Request a quote today
64	site_description_ar	الارتقاء بالضيافة مع مستلزمات فنادق متميزة — حيث تلتقي الجودة بالراحة لكل تجربة ضيف  — اطلب عرض سعر اليوم
3	og_title	The Experts - For Hotel Supplies
66	og_title_ar	الخبراء - لمستلزمات الفنادق
4	og_description	Elevating hospitality with premium supplies — where quality meets comfort for every guest experience.
68	og_description_ar	الارتقاء بالضيافة مع مستلزمات متميزة — حيث تلتقي الجودة بالراحة لكل تجربة ضيف.
5	twitter_title	The Experts - For Hotel Supplies
70	twitter_title_ar	الخبراء - لمستلزمات الفنادق
6	twitter_description	Elevating hospitality with premium supplies — where quality meets comfort for every guest experience.
72	twitter_description_ar	الارتقاء بالضيافة مع مستلزمات متميزة — حيث تلتقي الجودة بالراحة لكل تجربة ضيف.
7	org_name	The Experts
\.


--
-- Data for Name: session; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.session (sid, sess, expire) FROM stdin;
7ogciZnqVDMh0R1_u3wnOAXC9eq_0wcm	{"cookie":{"originalMaxAge":86400000,"expires":"2026-03-07T12:28:02.959Z","secure":false,"httpOnly":true,"path":"/"},"userId":1}	2026-03-07 14:16:37
zNUe2w6dBzZxbtFb0tySkKkL6fl4Jwob	{"cookie":{"originalMaxAge":86400000,"expires":"2026-03-08T10:46:49.394Z","secure":false,"httpOnly":true,"path":"/"},"userId":1}	2026-03-08 12:43:14
nw4sglFfBTi4WRPpE9Q2fzwkNrrXDGe6	{"cookie":{"originalMaxAge":86400000,"expires":"2026-03-07T18:15:37.174Z","secure":false,"httpOnly":true,"path":"/"},"userId":1}	2026-03-07 18:35:35
KovoBpHKpT9uN27JZ4722W99pKXnoM_V	{"cookie":{"originalMaxAge":86400000,"expires":"2026-03-07T18:02:28.770Z","secure":false,"httpOnly":true,"path":"/"},"userId":1}	2026-03-07 18:04:18
XPlPvkYKvo3gG5wdE3LGa3P9zBGAwocz	{"cookie":{"originalMaxAge":86400000,"expires":"2026-03-07T18:05:43.693Z","secure":false,"httpOnly":true,"path":"/"},"userId":1}	2026-03-07 18:06:23
\.


--
-- Data for Name: site_content; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.site_content (id, key, value_en, value_ar) FROM stdin;
2	about	About Us	من نحن
4	partners	Partners & Clients	شركاؤنا وعملاؤنا
5	partners_clients	Partners & Clients	شركاؤنا وعملاؤنا
6	sustainability	Sustainability	الاستدامة
7	contact	Contact	اتصل بنا
8	hero1_title	Supplying Comfort	توريد الراحة
9	hero1_subtitle	Excellence to Your Guests	التميز لضيوفك
10	hero1_desc	Experience the pinnacle of hospitality supply with our premium collection.	اختبر قمة توريد مستلزمات الضيافة مع مجموعتنا المميزة.
11	hero2_title	Bringing Elegance	إضفاء الأناقة
12	hero2_subtitle	Ease to Your Visitors	السهولة لزوارك
13	hero2_desc	Curated amenities that define sophistication and care.	مرافق مختارة بعناية تحدد الرقي والاهتمام.
14	hero3_title	Enhancing Every Stay	تحسين كل إقامة
15	hero3_subtitle	Style and Comfort	الأسلوب والراحة
17	discover_more	Discover More	اكتشف المزيد
18	all_in_one	All in One Place	الكل في مكان واحد
19	hospitality_solution	Your All-in-one Hospitality Solution	حلك المتكامل للضيافة
20	home_desc1	At The Experts, we supply premium hospitality products and essential hotel supplies across the Middle East.	في الخبراء، نقوم بتوريد منتجات الضيافة الفاخرة ومستلزمات الفنادق الأساسية في جميع أنحاء الشرق الأوسط.
21	home_desc2	Whether you operate a large hotel or a boutique property, our carefully curated offerings deliver consistent quality and a memorable guest experience.	سواء كنت تدير فندقاً كبيراً أو عقاراً صغيراً، فإن عروضنا المنسقة بعناية توفر جودة متسقة وتجربة ضيوف لا تُنسى.
22	our_categories	Our Categories	أقسامنا
23	cat_towels	Towels	المناشف
24	cat_minibar	Mini Bar & Safes	الميني بار والخزن
25	cat_amenities	Amenities	المرافق
27	cat_housekeeping	Housekeeping	التدبير الفندقي
28	cat_furniture	Furniture	الأثاث
29	cat_linens	Linens	البياضات
31	cat_banqueting	Banqueting	قاعات الاحتفالات
32	cat_spa	Spa	السبا
33	cat_room_service	Room Service	خدمة الغرف
34	stat_offices	Offices	مكاتب
35	stat_warehouses	Warehouses	مستودعات
36	stat_countries	Countries Served	دول نخدمها
37	stat_skus	SKUs	وحدة حفظ مخزون
38	stat_product_lines	Product Lines	خطوط الإنتاج
39	stat_brands	Brands	علامة تجارية
40	stat_projects	Projects	مشروع
41	stat_clients	Clients	عميل
43	quick_links	Quick Links	روابط سريعة
44	categories	Categories	الأقسام
45	contact_us	Contact Us	اتصل بنا
46	rights_reserved	All rights reserved.	جميع الحقوق محفوظة.
47	who_we_are	Who We Are	من نحن
52	chairman_name	Alaa Abdeen	علاء عابدين
53	chairman_title	Chairman	رئيس مجلس الإدارة
54	our_mission	Our Mission	مهمتنا
55	mission_desc	Streamlining hotel procurement with premium, cost-effective amenities and reliable delivery.	تبسيط شراء مستلزمات الفنادق مع مرافق عالية الجودة وفعالة من حيث التكلفة وتسليم موثوق.
56	our_vision	Our Vision	رؤيتنا
57	vision_desc	To be the global leader in hotel procurement, delivering innovative, high-quality solutions.	أن نكون الرائد العالمي في شراء مستلزمات الفنادق، ونقدم حلولاً مبتكرة وعالية الجودة.
58	our_leadership	Our Leadership	قيادتنا
59	sustainability_quote	Sustainability is transforming the hospitality industry, driving a shift toward eco-friendly practices and responsible sourcing.	الاستدامة تحول صناعة الضيافة، وتدفع التحول نحو الممارسات الصديقة للبيئة والتوريد المسؤول.
60	our_practices	Our Practices	ممارساتنا
30	cat_buffet_banqueting	Buffet & Banqueting	أستاندات البوفيه والمآدب
50	chairman_msg	Chairman's Message	رسالة رئيس مجلس الإدارة
1	home	Home	الرئيسية
3	products	Products	المنتجات
48	founded_in	Founded in Amman in 2005	تأسست شركتنا في عمّان عام 2005
61	harmony	Harmony of Quality and Nature	تناغم الجودة والطبيعة
62	sustain_desc1	At The Experts, we believe sustainability and quality go hand in hand. That's why we craft high-quality amenities using eco-friendly materials, responsible sourcing, and sustainable production methods.	في الخبراء، نؤمن بأن الاستدامة والجودة يسيران جنباً إلى جنب. ولهذا السبب نصنع مرافق عالية الجودة باستخدام مواد صديقة للبيئة، وتوريد مسؤول، وأساليب إنتاج مستدامة.
63	sustain_desc2	From biodegradable essentials to recyclable packaging, every detail is designed to reduce environmental impact without compromising excellence.	من الأساسيات القابلة للتحلل الحيوي إلى التغليف القابل لإعادة التدوير، تم تصميم كل التفاصيل لتقليل الأثر البيئي دون المساومة على التميز.
64	ecovadis_title	EcoVadis Certification	شهادة إيكوفاديس
65	ecovadis_desc	We are proud to announce our pursuit of EcoVadis certification, a globally recognized standard for ethical and sustainable business practices. This achievement reflects our dedication to eco-friendly sourcing and responsible manufacturing.	نحن فخورون بالإعلان عن سعينا للحصول على شهادة إيكوفاديس، وهي معيار معترف به عالمياً لممارسات الأعمال الأخلاقية والمستدامة. يعكس هذا الإنجاز تفانينا في التوريد الصديق للبيئة والتصنيع المسؤول.
66	download_sop	Download Our SOP	تحميل إجراءات العمل
67	employee_handbook	Employee Handbook	دليل الموظف
68	get_in_touch	Get in touch with our global offices	تواصل مع مكاتبنا العالمية
69	send_message	Send us a message	أرسل لنا رسالة
70	full_name	Full Name	الاسم الكامل
71	email_addr	Email Address	البريد الإلكتروني
72	subject	Subject	الموضوع
73	message	Message	الرسالة
74	submit	Send Message	إرسال الرسالة
75	our_locations	Our Locations	مواقعنا
76	dubai	Dubai, UAE	دبي، الإمارات
77	riyadh	Riyadh, KSA	الرياض، السعودية
78	amman	Amman, Jordan	عمان، الأردن
79	trusted_by	Trusted by world-class hospitality brands	موثوق به من قبل علامات تجارية عالمية في مجال الضيافة
80	partner_excellence	Partner with Excellence	شراكة مع التميز
81	partner_desc	We collaborate with the world's most prestigious hotel groups to deliver uncompromised quality and bespoke guest experiences. Join our network of successful partners today.	نحن نتعاون مع مجموعات الفنادق المرموقة في العالم لتقديم جودة غير مساومة وتجارب ضيوف مخصصة. انضم إلى شبكة شركائنا الناجحة اليوم.
82	become_partner	Become a Partner	كن شريكاً
83	our_products	Our Products	منتجاتنا
84	explore_range	Explore our comprehensive range of hotel supplies designed to elevate your guest experience.	استكشف مجموعتنا الشاملة من مستلزمات الفنادق المصممة لرفع تجربة ضيوفك.
85	looking_specific	Looking for something specific?	تبحث عن شيء محدد؟
86	contact_sales	Contact Sales Team	اتصل بفريق المبيعات
87	back_to_categories	Back to All Categories	العودة إلى جميع الأقسام
88	rs_trolley	Elite Service Trolley	عربة خدمة النخبة
89	rs_trolley_desc	Handcrafted from solid walnut with whisper-quiet, non-marking wheels. Featuring integrated heating compartments and foldable side wings for space efficiency.	مصنوعة يدوياً من الجوز الصلب مع عجلات هادئة وغير ملوثة. تتميز بحجرات تسخين مدمجة وأجنحة جانبية قابلة للطي لكفاءة المساحة.
90	rs_carafe	Signature Thermal Carafe	إبريق حراري مميز
91	rs_carafe_desc	Double-walled vacuum insulation keeps beverages at the perfect temperature for up to 12 hours. Ergonomic handle and drip-free pouring spout for effortless service.	عزل مزدوج الجدار يحافظ على المشروبات في درجة حرارة مثالية لمدة تصل إلى 12 ساعة. مقبض مريح وفوهة صب بدون تنقيط لخدمة سهلة.
92	rs_cloche	Mirror-Finish Cloche	غطاء طعام بلمسة مرآة
93	rs_cloche_desc	Precision-engineered from 18/10 stainless steel. High-mirror polish adds a touch of theater to the dining experience while maintaining optimal food temperature.	مصمم بدقة من الفولاذ المقاوم للصدأ 18/10. يضيف التلميع العالي لمسة من الأناقة لتجربة الطعام مع الحفاظ على درجة حرارة الطعام المثالية.
94	spa_towels	Premium Cotton Towels	مناشف قطنية عالية الجودة
95	spa_towels_desc	Ultra-absorbent, 800 GSM Egyptian cotton towels for a spa-like feel.	فائقة الامتصاص، قطن مصري 800 جرام لكل متر مربع لإحساس يشبه السبا.
96	spa_robes	Premium Bathrobes	أرواب حمام مريحة
97	spa_robes_desc	Soft, breathable waffle-weave robes designed for maximum comfort.	أرواب ناعمة وقابلة للتنفس مصممة لتوفير أقصى درجات الراحة.
98	spa_essentials	Aromatherapy Essentials	أساسيات العلاج العطري
99	spa_essentials_desc	Curated selection of essential oils and candles for relaxation.	مجموعة مختارة من الزيوت العطرية والشموع للاسترخاء.
100	amenities_sig	Signature Collection	مجموعة التوقيع
101	amenities_sig_desc	Eco-friendly bathroom amenities with botanical extracts.	مرافق حمام صديقة للبيئة مع خلاصات نباتية.
102	amenities_kits	Personal Care Kits	أطقم العناية الشخصية
103	amenities_kits_desc	Thoughtfully curated kits for the modern traveler.	أطقم منسقة بعناية للمسافر العصري.
104	amenities_custom	Custom Branded Sets	مجموعات مخصصة
105	amenities_custom_desc	High-quality products tailored to your hotel's identity.	منتجات عالية الجودة مصممة لتناسب هوية فندقك.
106	buffet_modular	Modular Buffet Systems	أنظمة بوفيه modular
107	buffet_modular_desc	Sleek, versatile buffet stands that adapt to any space and style.	أستاندات بوفيه أنيقة ومتعددة الاستخدامات تتكيف مع أي مساحة وأسلوب.
108	buffet_tables	Premium Banquet Tables	طاولات حفلات عالية الجودة
109	buffet_tables_desc	Durable and elegant tables designed for high-capacity events.	طاولات متينة وأنيقة مصممة للفعاليات ذات السعة العالية.
110	buffet_present	Elegant Food Presentation	تقديم طعام أنيق
111	buffet_present_desc	Elevated risers and platters to showcase culinary excellence.	رافعات وأطباق مرتفعة لعرض التميز في الطهي.
112	fb_cocktail	Cocktail Accessories	إكسسوارات الكوكتيل
113	fb_cocktail_desc	Colorful and stylish stirrers, skewers, and picks for premium bar service.	أدوات تقليب وأسياخ ملونة وأنيقة لخدمة بار متميزة.
114	fb_glass	Glassware Collection	مجموعة الأواني الزجاجية
115	fb_glass_desc	Elegant, high-clarity glassware for every beverage type.	أواني زجاجية أنيقة وعالية الوضوح لكل نوع من المشروبات.
116	fb_bar	Bar Equipment	معدات البار
117	fb_bar_desc	Professional-grade tools for precision mixology.	أدوات احترافية لدقة خلط المشروبات.
118	linens_bed	Premium Bed Linens	بياضات أسرّة عالية الجودة
119	linens_bed_desc	High-thread-count cotton sheets for ultimate guest comfort.	ملاءات قطنية بعدد خيوط عالٍ لراحة الضيوف القصوى.
120	linens_towels	Premium Towel Sets	أطقم مناشف عالية الجودة
121	linens_towels_desc	Plush, absorbent towels in various weights and sizes.	مناشف ناعمة وماصة بأوزان وأحجام مختلفة.
122	linens_housekeeping	Housekeeping Essentials	أساسيات التدبير المنزلي
123	linens_housekeeping_desc	Efficient solutions for maintaining pristine guest rooms.	حلول فعالة للحفاظ على غرف الضيوف في حالة مثالية.
26	cat_food_beverage	Food & Beverage	الأغذية والمشروبات
125	cat_vv	vv	البوفيه والمآدبالزور
130	about_hero_desc	Discover our story, mission, and the values that drive us to deliver excellence in hospitality.	اكتشف قصتنا ومهمتنا والقيم التي تدفعنا لتقديم التميز في الضيافة.
131	sustainability_hero_desc	Committed to eco-friendly practices and responsible sourcing for a better future.	ملتزمون بالممارسات الصديقة للبيئة والتوريد المسؤول من أجل مستقبل أفضل.
132	room_service_hero_desc	Elevating in-room dining with premium service equipment and elegant presentation.	الارتقاء بتجربة تناول الطعام داخل الغرف مع معدات خدمة متميزة وتقديم أنيق.
133	category_hero_desc	Browse our curated selection of premium hospitality products.	تصفح مجموعتنا المختارة من منتجات الضيافة المتميزة.
16	hero3_desc	Transforming ordinary stays into extraordinary memories.	تحويل الإقامات العادية إلى ذكريات استثنائية.
135	cat_bashar_cat	bashar	بشار
137	leader1_name	Alaa Abdin	علاء عابدين
138	leader1_role	General Manager	مدير عام
139	leader2_name	Rafat Daood	رأفت داود
140	leader2_role	Sales Manager	مدير المبيعات
141	leader3_name	Marwan Abu Sakha	مروان أبو سخا
142	leader3_role	Group Corporate Development Manager	مدير تطوير المجموعة
143	leader4_name	Marwan Abu Sakha	مروان أبو سخا
144	leader4_role	Group Corporate Development Manager	مدير تطوير المجموعة
151	hero4_title		
152	hero4_subtitle		
153	hero4_desc		
42	footer_desc	Supplying comfort and quality to your guests. Premium hospitality products across the Middle East.	توريد الراحة والجودة لضيوفك. منتجات ضيافة متميزة في جميع أنحاء الشرق الأوسط.
165	_seed_version	2	2
156	footer_text	The Experts For Hotels Supplies Company 	شركة الخبراء لتوريد مستلزمات الفنادق
166	spa_stones	Hot Stone Sets	أطقم الأحجار الساخنة
167	spa_stones_desc	Professional basalt stones for premium spa treatments.	أحجار بازلت احترافية لعلاجات السبا المتميزة.
168	towels_bath	Luxury Bath Towels	مناشف حمام فاخرة
169	towels_bath_desc	Zero-twist cotton towels with superior absorption.	مناشف قطنية زيرو تويست بامتصاص فائق.
170	towels_hand	Jacquard Hand Towels	مناشف يد جاكار
171	towels_hand_desc	Elegant patterned towels with custom monogramming.	مناشف بأنماط أنيقة مع إمكانية نقش الشعار.
172	towels_pool	Pool & Beach Towels	مناشف المسبح والشاطئ
173	towels_pool_desc	Oversized cabana-stripe towels in vibrant resort colors.	مناشف كابانا كبيرة بألوان المنتجعات النابضة بالحياة.
174	minibar_silent	Silent Absorption Minibars	ميني بار صامت
175	minibar_silent_desc	Zero-decibel thermoelectric cooling with A++ energy rating.	تبريد كهروحراري بدون صوت مع تصنيف طاقة A++.
176	minibar_safe	Digital In-Room Safes	خزائن رقمية للغرف
177	minibar_safe_desc	Motorized safes with audit trail and emergency override.	خزائن بمحرك مع سجل مراجعة وتجاوز طوارئ.
178	housekeeping_cart	Professional Carts	عربات احترافية
179	housekeeping_cart_desc	Heavy-duty carts with lockable storage and ergonomic design.	عربات متينة بتخزين قابل للقفل وتصميم مريح.
180	housekeeping_vacuum	Cordless Vacuums	مكانس لاسلكية
181	housekeeping_vacuum_desc	Ultra-quiet HEPA filtration for occupied-room cleaning.	تصفية HEPA هادئة للغاية لتنظيف الغرف المشغولة.
182	housekeeping_eco	Eco-Friendly Kits	أطقم صديقة للبيئة
183	housekeeping_eco_desc	Biodegradable cleaning solutions certified for hospitality.	حلول تنظيف قابلة للتحلل معتمدة للضيافة.
184	furniture_desk	Executive Desks	مكاتب تنفيذية
185	furniture_desk_desc	Solid walnut desks with wireless charging and cable management.	مكاتب من خشب الجوز الصلب مع شحن لاسلكي وإدارة كابلات.
186	furniture_chair	Lounge Chairs	كراسي استرخاء
187	furniture_chair_desc	Italian-designed chairs with fire-retardant premium upholstery.	كراسي بتصميم إيطالي بتنجيد فاخر مقاوم للحريق.
188	furniture_table	Bedside Tables	طاولات جانبية
189	furniture_table_desc	Minimalist tables with touch lighting and USB-C charging.	طاولات بتصميم بسيط مع إضاءة لمسية وشحن USB-C.
190	banquet_chair	Stackable Chairs	كراسي قابلة للتكديس
191	banquet_chair_desc	Commercial-grade chairs with lumbar support, stack 10 high.	كراسي بدرجة تجارية مع دعم قطني، تتكدس 10 كراسي.
192	banquet_table	Folding Tables	طاولات قابلة للطي
193	banquet_table_desc	Heavy-duty ABS tables with powder-coated steel frames.	طاولات ABS متينة بإطارات فولاذ مطلية.
194	banquet_stage	Stage Platforms	منصات مسرح
195	banquet_stage_desc	Modular interlocking platforms for events of any size.	منصات معيارية متشابكة لفعاليات بأي حجم.
196	_seeded_partners	1	1
197	_seeded_categories	1	1
198	_seeded_brands	1	1
199	_seeded_clients	1	1
200	_seeded_products	1	1
201	_seeded_leadership	1	1
202	_seeded_key_contacts	1	1
203	_seeded_quick_links	1	1
51	chairman_quote	Welcome to our company’s website.\n\nSince 2005, we have been committed to providing high-quality solutions to the hospitality sector in Jordan, built on trust, integrity, and excellence.\n\nWe are not simply a supplier, but a trusted partner dedicated to supporting our clients’ growth and success.\n\nWe look forward to continued collaboration and shared achievement.\n\nSincerely,	مرحبًا بكم في موقع شركتنا.\n\nمنذ عام 2005، نلتزم بتقديم حلول عالية الجودة لقطاع الضيافة في الأردن، قائمة على الثقة والنزاهة والتميز.\n\nنحن لا نعمل كمورّد فقط، بل كشريك موثوق يدعم نمو عملائنا ونجاحهم.\n\nنتطلع إلى استمرار التعاون وتحقيق المزيد من الإنجازات المشتركة.\n\nمع خالص التقدير،
49	about_desc	Founded with a clear vision to serve the hospitality sector, our company has grown into a trusted provider of hotel supplies in the Jordanian market.\n\nToday, we continue to deliver quality-driven solutions that support operational excellence and strengthen our clients’ success.	انطلقت شركتنا برؤية واضحة لخدمة قطاع الضيافة، ونمت لتصبح مزودًا موثوقًا لمستلزمات وتجهيزات الفنادق في السوق الأردني.\n\nواليوم نواصل تقديم حلول قائمة على الجودة تدعم كفاءة التشغيل وتعزز نجاح عملائنا.\n
251	stats_visible	true	true
252	stat_product_lines_value		
253	stat_brands_value		
254	stat_projects_value		
255	stat_clients_value		
277	_seeded_seo	1	1
\.


--
-- Data for Name: site_images; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.site_images (id, key, image_url, label) FROM stdin;
1447	favicon	/uploads/1772399634223-783648581.png	Favicon
2198	og_image	/uploads/1772627124742-473371385.png	Social Share Image
1	hero1	/uploads/hero-custom-1.png	Hero Banner 1
2	hero2	/uploads/hero-custom-2.png	Hero Banner 2
3	hero3	/uploads/hero-banner-3-new.png	Hero Banner 3
19	hero4		Hero Banner 4
4	logo	/uploads/site-logo-custom.png	Site Logo
5	products_banner	/uploads/products-banner.png	Products Page Banner
6	contact_banner	/uploads/contact-banner.png	Contact Page Banner
7	about_banner	/uploads/about-banner.jpg	About Page Banner
8	about_mission	/uploads/about-mission.jpg	About Mission Image
9	about_vision	/uploads/about-vision.jpg	About Vision Image
10	about_chairman	/uploads/about-chairman.jpg	About Chairman Image
11	partners_banner	/uploads/partners-banner.png	Partners Page Banner
12	partners_cta	/uploads/partners-cta.png	Partners CTA Image
15	category_banner	/uploads/category-banner.png	Category Detail Banner
241	home_section	/uploads/home-section-image.png	Home Section Image
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.users (id, username, password) FROM stdin;
1	admin	$2b$10$5XM5GTRw3SEpX.JR.E8SU.txV110GVaRksukX5pD.4lXboo3i5w4m
\.


--
-- Data for Name: visitor_sessions; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.visitor_sessions (id, session_id, first_visit, last_visit, page_count, device, browser, os, referrer, country, city, is_returning, landing_page, exit_page, duration, language) FROM stdin;
1	npyarincm6mmewb7jr	2026-03-06 12:53:38.712	2026-03-06 12:53:38.712	1	desktop	Chrome	Linux				f			0	
2	mk693cw7vqmmewc3fr	2026-03-06 12:54:20.057	2026-03-06 12:54:22.568	2	desktop	Chrome	Linux				f			0	
4	9um1un8wf1rmmex1xcj	2026-03-06 13:14:25.287	2026-03-06 13:15:01.507	2	desktop	Chrome	Linux				f	/	/	36	en
5	t05jrumkrmnmmex3qm3	2026-03-06 13:15:49.791	2026-03-06 13:15:49.791	1	desktop	Chrome	Linux				f	/	/	0	en
6	j3vyd8r6lcmmez0ix8	2026-03-06 14:09:19.519	2026-03-06 14:14:08.818	7	desktop	Chrome	macOS	https://e24cf016-21c9-4399-a654-3af271d57383-00-1v79cq3jzy1t6.riker.replit.dev/admin			f	/	/catalog	289	en
7	5ut89471ptbmmf7aehh	2026-03-06 18:00:56.897	2026-03-06 18:00:56.897	1	desktop	Chrome	Linux				f	/	/	0	en
8	bprf5bwfiyammf7c180	2026-03-06 18:02:13.042	2026-03-06 18:02:13.042	1	desktop	Chrome	Linux				f	/	/	0	en
10	q4fx473anpqmmf7g7ah	2026-03-06 18:05:27.5	2026-03-06 18:05:27.5	1	desktop	Chrome	Linux				f	/	/	0	en
12	2bkfxtgwczemmf829ks	2026-03-06 18:22:37.024	2026-03-06 18:22:37.024	1	mobile	Safari	macOS				f	/catalog	/catalog	0	en
11	yzwef2dpxpommf7i6by	2026-03-06 18:06:59.836	2026-03-06 18:33:47.325	3	mobile	Other	macOS	https://replit.com/			f	/	/catalog	1607	en
13	0m0uw1lz7s5mmf8gndn	2026-03-06 18:33:47.882	2026-03-06 18:33:47.882	1	desktop	Chrome	Linux				f	/	/	0	en
9	bgl8ztxinufmmf7dc8z	2026-03-06 18:03:14.316	2026-03-06 18:34:45.56	16	mobile	Other	macOS				f	/	/catalog	1891	en
14	xwdqb2zhm5dmmg7h6d7	2026-03-07 10:53:59.116	2026-03-07 10:53:59.116	1	desktop	Chrome	Linux				f	/	/	0	en
15	juhl3kjzjasmoo23wn5	2026-05-02 08:05:16.243	2026-05-02 08:05:16.243	1	desktop	Chrome	macOS	https://e24cf016-21c9-4399-a654-3af271d57383-00-1v79cq3jzy1t6.riker.replit.dev/__replco/workspace_iframe.html?initialPath=%2F&id=default-start-application			f	/	/	0	en
\.


--
-- Name: __drizzle_migrations_id_seq; Type: SEQUENCE SET; Schema: drizzle; Owner: -
--

SELECT pg_catalog.setval('drizzle.__drizzle_migrations_id_seq', 1, true);


--
-- Name: brands_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.brands_id_seq', 20, true);


--
-- Name: brands_sort_order_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.brands_sort_order_seq', 18, true);


--
-- Name: categories_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.categories_id_seq', 15, true);


--
-- Name: clients_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.clients_id_seq', 109, true);


--
-- Name: clients_sort_order_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.clients_sort_order_seq', 28, true);


--
-- Name: contact_messages_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.contact_messages_id_seq', 10, true);


--
-- Name: key_contacts_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.key_contacts_id_seq', 2, true);


--
-- Name: leadership_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.leadership_id_seq', 5, true);


--
-- Name: page_views_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.page_views_id_seq', 39, true);


--
-- Name: partners_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.partners_id_seq', 29, true);


--
-- Name: partners_sort_order_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.partners_sort_order_seq', 3, true);


--
-- Name: product_images_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.product_images_id_seq', 3, true);


--
-- Name: products_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.products_id_seq', 43, true);


--
-- Name: quick_links_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.quick_links_id_seq', 6, true);


--
-- Name: seo_settings_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.seo_settings_id_seq', 120, true);


--
-- Name: site_content_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.site_content_id_seq', 404, true);


--
-- Name: site_images_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.site_images_id_seq', 2996, true);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.users_id_seq', 1, true);


--
-- Name: visitor_sessions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.visitor_sessions_id_seq', 15, true);


--
-- Name: __drizzle_migrations __drizzle_migrations_pkey; Type: CONSTRAINT; Schema: drizzle; Owner: -
--

ALTER TABLE ONLY drizzle.__drizzle_migrations
    ADD CONSTRAINT __drizzle_migrations_pkey PRIMARY KEY (id);


--
-- Name: brands brands_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.brands
    ADD CONSTRAINT brands_pkey PRIMARY KEY (id);


--
-- Name: categories categories_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_pkey PRIMARY KEY (id);


--
-- Name: categories categories_slug_unique; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_slug_unique UNIQUE (slug);


--
-- Name: clients clients_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.clients
    ADD CONSTRAINT clients_pkey PRIMARY KEY (id);


--
-- Name: contact_messages contact_messages_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.contact_messages
    ADD CONSTRAINT contact_messages_pkey PRIMARY KEY (id);


--
-- Name: key_contacts key_contacts_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.key_contacts
    ADD CONSTRAINT key_contacts_pkey PRIMARY KEY (id);


--
-- Name: leadership leadership_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.leadership
    ADD CONSTRAINT leadership_pkey PRIMARY KEY (id);


--
-- Name: page_views page_views_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.page_views
    ADD CONSTRAINT page_views_pkey PRIMARY KEY (id);


--
-- Name: partners partners_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.partners
    ADD CONSTRAINT partners_pkey PRIMARY KEY (id);


--
-- Name: product_images product_images_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.product_images
    ADD CONSTRAINT product_images_pkey PRIMARY KEY (id);


--
-- Name: products products_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_pkey PRIMARY KEY (id);


--
-- Name: quick_links quick_links_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.quick_links
    ADD CONSTRAINT quick_links_pkey PRIMARY KEY (id);


--
-- Name: seo_settings seo_settings_key_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.seo_settings
    ADD CONSTRAINT seo_settings_key_key UNIQUE (key);


--
-- Name: seo_settings seo_settings_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.seo_settings
    ADD CONSTRAINT seo_settings_pkey PRIMARY KEY (id);


--
-- Name: session session_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.session
    ADD CONSTRAINT session_pkey PRIMARY KEY (sid);


--
-- Name: site_content site_content_key_unique; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.site_content
    ADD CONSTRAINT site_content_key_unique UNIQUE (key);


--
-- Name: site_content site_content_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.site_content
    ADD CONSTRAINT site_content_pkey PRIMARY KEY (id);


--
-- Name: site_images site_images_key_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.site_images
    ADD CONSTRAINT site_images_key_key UNIQUE (key);


--
-- Name: site_images site_images_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.site_images
    ADD CONSTRAINT site_images_pkey PRIMARY KEY (id);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: users users_username_unique; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_unique UNIQUE (username);


--
-- Name: visitor_sessions visitor_sessions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.visitor_sessions
    ADD CONSTRAINT visitor_sessions_pkey PRIMARY KEY (id);


--
-- Name: visitor_sessions visitor_sessions_session_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.visitor_sessions
    ADD CONSTRAINT visitor_sessions_session_id_key UNIQUE (session_id);


--
-- Name: IDX_session_expire; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_session_expire" ON public.session USING btree (expire);


--
-- Name: idx_page_views_created_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_page_views_created_at ON public.page_views USING btree (created_at);


--
-- Name: idx_page_views_path; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_page_views_path ON public.page_views USING btree (path);


--
-- Name: idx_page_views_session_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_page_views_session_id ON public.page_views USING btree (session_id);


--
-- Name: idx_visitor_sessions_last_visit; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_visitor_sessions_last_visit ON public.visitor_sessions USING btree (last_visit);


--
-- PostgreSQL database dump complete
--

\unrestrict tt93mOwszhADVBCIxo299Qqrv1gPMouF53CwdMR7ARdfd7z4MhriGre9POUXGMW

