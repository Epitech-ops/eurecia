# node-eurecia

Typescript wrapper for the Eurecia API

## Installation

`npm install node-eurecia --save`

## Usage

```typescript
const { Eurecia } = require('node-eurecia');

async function main() {
  try {
    const eureciaInstance = new Eurecia();
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

```typescript
// Authenticates with Eurecia API (mandatory before any call)
eureciaInstance.authenticate(token);
```

getCompanies(page)

```typescript
// Gets a page of companies
await eureciaInstance.getCompanies();
await eureciaInstance.getCompanies(0);
...
await eureciaInstance.getCompanies(42);
```

getAllCompanies()

```typescript
// Gets all pages of companies
await eureciaInstance.getAllCompanies();
```

getEmployees(page, active)

```typescript
// Gets a page of employees
await eureciaInstance.getEmployees();
await eureciaInstance.getEmployees(0, true);
...
await eureciaInstance.getEmployees(42, false);
```

getAllEmployees(active)

```typescript
// Gets all pages of employees
await eureciaInstance.getAllEmployees();
await eureciaInstance.getAllEmployees(true);
await eureciaInstance.getAllEmployees(false);
```

getEmployeeById(id)

```typescript
// Gets an employee by its id
await eureciaInstance.getEmployeeById('id');
```

getDepartments()

```typescript
// Gets all departments
await eureciaInstance.getDepartments();
```

getStructures()

```typescript
// Gets all structures
await eureciaInstance.getStructures();
```

getVacationAccumulationForUser(id)

```typescript
// Gets all vacation accumulation for user id
await eureciaInstance.getVacationAccumulationForUser('id');
```

## License

[MIT](LICENSE)
