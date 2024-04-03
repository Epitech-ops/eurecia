# node-eurecia

Node wrapper for the Eurecia API

## Installation

`npm install node-eurecia --save`

## Usage

```javascript
const eurecia = require('node-eurecia');

async function main() {
  try {
    const eureciaInstance = new eurecia();
    await eureciaInstance.authenticate(process.env['EURECIA_TOKEN']);
    const allEmployees = await eureciaInstance.getAllEmployees();
    for (const employee of allEmployees) {
      try {
        const employeeData = await eureciaInstance.getEmployeeById(employee.id);
        console.log(employeeData);
      } catch (error) {
        console.error(error);
      }
    }
  } catch (error) {
    console.error(error);
  }
}
```

## API reference

authenticate(token)

```javascript
// Authenticates with Eurecia API (mandatory before any call)
eureciaInstance.authenticate(token);
```

getCompanies(page)

```javascript
// Gets a page of companies
await eureciaInstance.getCompanies();
await eureciaInstance.getCompanies(0);
...
await eureciaInstance.getCompanies(42);
```

getAllCompanies()

```javascript
// Gets all pages of companies
await eureciaInstance.getAllCompanies();
```

getEmployees(page, active)

```javascript
// Gets a page of employees
await eureciaInstance.getEmployees();
await eureciaInstance.getEmployees(0, true);
...
await eureciaInstance.getEmployees(42, false);
```

getAllEmployees(active)

```javascript
// Gets all pages of employees
await eureciaInstance.getAllEmployees();
await eureciaInstance.getAllEmployees(true);
await eureciaInstance.getAllEmployees(false);
```

getEmployeeById(id)

```javascript
// Gets an employee by its id
await eureciaInstance.getEmployeeById('id');
```

getDepartments()

```javascript
// Gets all departments
await eureciaInstance.getDepartments();
```

getStructures()

```javascript
// Gets all structures
await eureciaInstance.getStructures();
```

getPayrollGrids()

```javascript
// Gets all payroll grids
await eureciaInstance.getPayrollGrids();
```

## License

[MIT](LICENSE)
