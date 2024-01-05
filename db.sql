CREATE TABLE
    valores.users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        noStudent VARCHAR(255) NOT NULL,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        password VARCHAR(255) NOT NULL
    );

CREATE TABLE
    IF NOT EXISTS admins (
        noEmployee INT PRIMARY KEY,
        password VARCHAR(255) NOT NULL

INSERT INTO
    admins (noEmployee, password)
VALUES (101, '12345'), (102, '12345');

);

CREATE TABLE
    books (
        idB INT PRIMARY KEY AUTO_INCREMENT,
        title VARCHAR(255) NOT NULL,
        author VARCHAR(255) NOT NULL,
        publication_date DATE,
        isbn VARCHAR(20),
        pdf VARCHAR(255) NOT NULL,
        noEmployee INT,
        FOREIGN KEY (noEmployee) REFERENCES admins(noEmployee)
    );

INSERT INTO
    books (
        title,
        author,
        publication_date,
        isbn,
        pdf,
        noEmployee
    )
VALUES (
        'Libro 1',
        'Autor 1',
        '2022-01-01',
        'ISBN123',
        '/path/to/pdf1.pdf',
        101
    ), (
        'Libro 2',
        'Autor 2',
        '2022-02-01',
        'ISBN456',
        '/path/to/pdf2.pdf',
        102
    );