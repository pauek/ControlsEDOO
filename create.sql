
CREATE TABLE controls (TEMA TEXT, AULA TEXT, DATA TEXT);

CREATE TABLE alumnes (NOM TEXT, LOGIN TEXT);

CREATE TABLE temes (TEMA TEXT, AULA TEXT, DATA TEXT);

CREATE TABLE inscits (id_alumne INTEGER, id_control INTEGER);

CREATE TABLE notes (id_alumne INTEGER, id_control INTEGER, nota INTEGER);

CREATE TABLE professors (loginUPC TEXT, nom TEXT);


