CREATE TABLE book (
  id SERIAL PRIMARY KEY,
  title character varying(255) NOT NULL UNIQUE,
  author character varying(255) NOT NULL,
  created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE TABLE user (
  id SERIAL PRIMARY KEY,
  first_name character varying(255) NOT NULL,
  last_name character varying(255) NOT NULL,
  email character varying(255) NOT NULL UNIQUE,
  password character varying(255) NOT NULL,
  token character varying(255) NOT NULL,
  created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);

INSERT INTO book (title, author) VALUES 
('Harry Potter and The Philosophers Stone', 'J. K. Rowling'), 
('Harry Potter and The Chamber of Secrets', 'J. K. Rowling'), 
('Harry Potter and The Prisoner of Azkaban.', 'J. K. Rowling'), 
('Harry Potter and The Goblet of Fire.', 'J. K. Rowling'), 
('Harry Potter and The Order of the Phoenix.', 'J. K. Rowling'), 
('Harry Potter and The Half-Blood Prince.', 'J. K. Rowling'), 
('Harry Potter and The Deathly Hallows.', 'J. K. Rowling'), 
('The Great Gatsby.', 'F. Scott Fitzgerald'), 
('Wuthering Heights.', 'Emily Brontë'), 
('The Handmaids Tale.', 'Margaret Atwood'), 
('Things Fall Apart.', 'Chinua Achebe'), 
('1984.', 'George Orwell'), 
('Beloved.', 'Toni Morrison'), 
('The Catcher in the Rye.', 'J.D. Salinger'), 
('Great Expectations.', 'Charles Dickens'), 
('To Kill A Mockingbird.', 'Harper Lee'),
('In Cold Blood.', 'Truman Capote');