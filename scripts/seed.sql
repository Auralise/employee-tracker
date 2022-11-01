USE employee_db;

INSERT INTO department (name) 
VALUES  ('Engineering'),
        ('IT'), 
        ('HR'),
        ('Marketing');

INSERT INTO role (title, salary, department_id)
VALUES  ('Engineering Manager', 150000, 1),
        ('Software Engineer', 100000, 1),
        ('Engineering Intern', 70000, 1),
        ('IT Manager', 120000, 2),
        ('Support Engineer', 100000, 2),
        ('Service Desk Team Lead', 100000, 2),
        ('Service Desk Analyst', 75000, 2),
        ('HR Manager', 135000, 3),
        ('HR Officer', 110000, 3),
        ('Marketing Manager', 140000, 4),
        ('Copywriter', 110000, 4);

/*
    ROLE IDs for testing
    1 - Engineering Manager
    2 - Software Engineer
    3 - Eng Intern
    4 - IT Manager
    5 - Support Engineer
    6 - Service Desk Team Lead
    7 - SDA
    8 - HR Manager
    9 - HR Officer
    10 - Marketing Manager
    11 - Copywriter
*/

INSERT INTO employee (first_name, last_name, role_id, manager_id) 
VALUES  ('Michael', 'Paulson', 1, NULL),
        ('Jennifer', 'Michaelson', 2, 1),
        ('John', 'Kransky', 3, 1),
        ('Sarah', 'Robinson', 4, NULL),
        ('Jon', 'Oldfeld', 5, 4),
        ('Sven', 'Goodwit', 6, 4),
        ('David', 'Doese', 7, 6),
        ('Kyle', 'Sopher', 7, 6),
        ('Blake', 'Ryan', 8, NULL), 
        ('Stephanie', 'Berins', 9, 9),
        ('Jenna', 'Doren', 10, NULL),
        ('Robert', 'Mirak', 11, 11);


