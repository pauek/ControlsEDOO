
CREATE TABLE controls (tema TEXT, aula TEXT, data TEXT);

CREATE TABLE alumnes (nom TEXT, login TEXT, password TEXT);

CREATE TABLE temes (tema TEXT, aula TEXT, data TEXT);

CREATE TABLE inscits (id_alumne INTEGER, id_control INTEGER);

CREATE TABLE notes (id_alumne INTEGER, id_control INTEGER, nota INTEGER);

CREATE TABLE professors (loginUPC TEXT, nom TEXT);


