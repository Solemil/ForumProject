DROP TABLE IF EXISTS votes;
DROP TABLE IF EXISTS posts;
DROP TABLE IF EXISTS owners;

CREATE TABLE owners (
id INT AUTO_INCREMENT,
name VARCHAR(255),
PRIMARY KEY (id)
);

INSERT INTO owners (name)
VALUES
	('User1'),
	('User2');

CREATE TABLE posts (
	id INT AUTO_INCREMENT,
	title VARCHAR(255) NOT NULL,
	url VARCHAR(255) NOT NULL,
	timestamp bigint NOT NULL DEFAULT(current_timestamp()),
	score INT DEFAULT 0,
	owner_Id INT,
	FOREIGN KEY (owner_Id) REFERENCES owners(id),
	PRIMARY KEY (id)
);

INSERT INTO posts (title, url, owner_Id)
VALUES
	('Post1', "9gag.com", 1),
	('Post2', "9gag.com", 2);
	
CREATE TABLE votes (
id INT PRIMARY KEY AUTO_INCREMENT,
owner_Id INT,
post_Id INT,
vote INT DEFAULT 0,
FOREIGN KEY (owner_Id) REFERENCES owners(id),
FOREIGN KEY (post_Id) REFERENCES posts(id)
);