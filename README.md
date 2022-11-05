
# Employee Tracker

![MIT Licence](https://img.shields.io/badge/licence-MIT-green?style=flat)

## Description

This software is designed to make it easy to interface with a simple employee database to keep track of your employee's details which are relevant to the company as well as the roles and departments that they belong to and the managers they report to.

## Table of Contents 

- [Installation](#installation)
- [Usage](#usage)
- [Tests](#tests)
- [Technology](#technology)
- [Credits](#credits)
- [License](#licence)

## Installation

1. Clone this repo

2. Log into your MySQL server in the root folder of this projcet using `mysql -u <systemAdminUname> -p`

3. Once you have logged into the database, run the **schema.sql** script by executing `mysql> source scripts/schema.sql` - Please note that this script also creates a database user with access to the employee database which is used in the application. Please configure credential in this script before running. On first run, this script will attempt to drop a non-existent user and will display an error. This is due to MySQL being unable to conditionally drop a user and  is safe to ignore.

4. (optional) If you want to use some test data to experiment with the datatbase and the application's functionality, there is a small seed script which has been included. Run this by using `mysql> source scripts/seed.sql`

5. Run `npm install` from the parent directory to install all of the dependencies

Please note that if you want to change the password used by the application, you will need to change it in two places: 

### schema.sql:
```
42  -  CREATE USER 'empdb'@'localhost' IDENTIFIED BY '<password here>'; 
```

### index.js:
```
14  -  password: "<password here>"
```

## Usage

The interface is quite self explanitory and provides all usage option in the main menu and has prompts at each stage. To run the application use: 

```
node index.js
```

A demonstration video of the application being used [can be found here](https://youtu.be/0f27e4DdBlI)

## Tests

This application does not come with included tests.

## Technology

- node.js
- mysql server
- Inquirer 8.2.4 (npm package)
- mysql2 (npm package)
- console.table (npm package)


## Credits

- James Prince



## Licence

URL: https://choosealicense.com/licenses/mit/

```

  MIT License

  Copyright (c)  James Prince
  
  Permission is hereby granted, free of charge, to any person obtaining a copy
  of this software and associated documentation files (the "Software"), to deal
  in the Software without restriction, including without limitation the rights
  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
  copies of the Software, and to permit persons to whom the Software is
  furnished to do so, subject to the following conditions:
  
  The above copyright notice and this permission notice shall be included in all
  copies or substantial portions of the Software.
  
  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
  SOFTWARE.
```

  

---

## How to Contribute

Contributions are not sought at this time however if you feel that you have something to add to this project, please feel free to contact me directly to discuss contribution options. 

## Questions

[My Github](https://github.com/Auralise)

[Email me](mailto:james.prince1@gmail.com)

---

Copyright &copy; 2022, James Prince
