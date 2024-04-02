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
