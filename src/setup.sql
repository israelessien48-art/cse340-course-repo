CREATE TABLE organization (
    organization_id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    contact_email VARCHAR(255) NOT NULL,
    logo_filename VARCHAR(255) NOT NULL
);

INSERT INTO organization (name, description, contact_email, logo_filename)
VALUES
(
    'BrightFuture Builders',
    'A nonprofit focused on improving community infrastructure through sustainable construction projects.',
    'info@brightfuturebuilders.org',
    'brightfuture-logo.png'
),
(
    'GreenHarvest Growers',
    'An urban farming collective promoting food sustainability and education in local neighborhoods.',
    'contact@greenharvest.org',
    'greenharvest-logo.png'
),
(
    'UnityServe Volunteers',
    'A volunteer coordination group supporting local charities and service initiatives.',
    'hello@unityserve.org',
    'unityserve-logo.png'
);

CREATE TABLE project (
    project_id SERIAL PRIMARY KEY,
    organization_id INTEGER NOT NULL REFERENCES organization(organization_id),
    title VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    location VARCHAR(255) NOT NULL,
    date DATE NOT NULL
);

INSERT INTO project
    (organization_id, title, description, location, date)
VALUES
    (1, 'Community Park Renovation', 'Help renovate a local community park by improving pathways, benches, and shared spaces.', 'Central Community Park', '2026-09-12'),
    (1, 'Neighborhood Playground Build', 'Assist with preparing and improving a safe playground area for children and families.', 'Riverside Neighborhood', '2026-09-19'),
    (1, 'Community Center Repair', 'Support repairs and improvements to a community center used for local programs and events.', 'Downtown Community Center', '2026-09-26'),
    (1, 'Accessible Walkway Project', 'Help construct and improve accessible walkways around a community facility.', 'Westside Community', '2026-10-03'),
    (1, 'Sustainable Garden Construction', 'Build garden spaces using sustainable materials and community-friendly construction methods.', 'Greenfield Community', '2026-10-10'),

    (2, 'Urban Garden Planting', 'Help prepare planting areas and establish an urban community garden.', 'Northside Community Garden', '2026-09-13'),
    (2, 'Community Vegetable Harvest', 'Assist volunteers with harvesting and organizing fresh vegetables for the local community.', 'GreenHarvest Farm', '2026-09-20'),
    (2, 'Composting Workshop', 'Help prepare a community workshop focused on composting and sustainable food practices.', 'Eastside Community Center', '2026-09-27'),
    (2, 'School Garden Project', 'Assist students and volunteers with creating and maintaining a school garden.', 'Lincoln Elementary School', '2026-10-04'),
    (2, 'Food Sustainability Fair', 'Support a community event promoting sustainable food production and healthy gardening practices.', 'City Community Hall', '2026-10-11'),

    (3, 'Food Donation Drive', 'Help collect, organize, and distribute donated food to local families and community partners.', 'UnityServe Community Center', '2026-09-14'),
    (3, 'Senior Center Volunteer Day', 'Assist with community activities and facility support at a local senior center.', 'Lakeside Senior Center', '2026-09-21'),
    (3, 'Community Cleanup Day', 'Join volunteers in cleaning and improving shared public spaces in the community.', 'Southside Neighborhood', '2026-09-28'),
    (3, 'School Supply Drive', 'Help collect and organize school supplies for students and families who need support.', 'UnityServe Volunteer Center', '2026-10-05'),
    (3, 'Charity Outreach Event', 'Support volunteers coordinating an outreach event for local community organizations.', 'Central Civic Hall', '2026-10-12');

CREATE TABLE category (
    category_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE
);

INSERT INTO category (name)
VALUES
    ('Environmental'),
    ('Educational'),
    ('Community Service'),
    ('Health and Wellness');

CREATE TABLE project_category (
    project_id INTEGER NOT NULL REFERENCES project(project_id),
    category_id INTEGER NOT NULL REFERENCES category(category_id),
    PRIMARY KEY (project_id, category_id)
);

INSERT INTO project_category (project_id, category_id)
VALUES
    (1, 4),
    (2, 3),
    (3, 3),
    (4, 4),
    (5, 1),
    (6, 1),
    (7, 1),
    (8, 1),
    (9, 2),
    (10, 1),
    (11, 2),
    (12, 3),
    (13, 1),
    (14, 1),
    (15, 3);

CREATE TABLE roles (
    role_id SERIAL PRIMARY KEY,
    role_name VARCHAR(50) UNIQUE NOT NULL,
    role_description TEXT
);

INSERT INTO roles (role_name, role_description)
VALUES
    ('user', 'Standard user with basic access'),
    ('admin', 'Administrator with full system access');

CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role_id INTEGER REFERENCES roles(role_id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
