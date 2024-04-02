const assert = require('assert');
const axios = require('axios');
const nock = require('nock');
const Eurecia = require('./index');

describe('Eurecia', () => {
  const baseUrl = 'https://api.eurecia.com';
  let eurecia;
  axios.defaults.adapter = 'http';

  before(() => {
    eurecia = new Eurecia();
  });

  after(() => {});

  beforeEach(() => {});

  afterEach(() => {});

  describe('authenticate', () => {
    it('should throw an error when axios throws', async () => {
      const scope = nock(baseUrl)
        .get('/eurecia/rest/v1/Auth')
        .matchHeader('Accept', 'application/json')
        .matchHeader('authToken', 'invalid-token')
        .reply(500, null);
      try {
        await eurecia.authenticate('invalid-token');
      } catch (error) {
        assert.strictEqual(error.message, 'Invalid token (#1)');
        scope.done();
      }
    });

    it('should throw an error for a non 200 http code', async () => {
      const scope = nock(baseUrl)
        .get('/eurecia/rest/v1/Auth')
        .matchHeader('Accept', 'application/json')
        .matchHeader('authToken', 'invalid-token')
        .reply(204, null);
      try {
        await eurecia.authenticate('invalid-token');
      } catch (error) {
        assert.strictEqual(error.message, 'Invalid token (#2)');
        scope.done();
      }
    });

    it('should throw an error for an invalid returned object', async () => {
      const response = {
        eureciaResponse: {
          temporaryToken: {
            token: {},
          },
        },
      };
      const scope = nock(baseUrl)
        .get('/eurecia/rest/v1/Auth')
        .matchHeader('Accept', 'application/json')
        .matchHeader('authToken', 'valid-token')
        .reply(200, response);
      try {
        await eurecia.authenticate('valid-token');
      } catch (error) {
        assert.strictEqual(error.message, 'Invalid token (#3)');
        scope.done();
      }
    });

    it('should set the instance with the correct token', async () => {
      const response = {
        eureciaResponse: {
          temporaryToken: {
            token: {
              $: 'temporary-token',
            },
          },
        },
      };
      const scope = nock(baseUrl)
        .get('/eurecia/rest/v1/Auth')
        .matchHeader('Accept', 'application/json')
        .matchHeader('authToken', 'valid-token')
        .reply(200, response);
      await eurecia.authenticate('valid-token');
      assert.strictEqual(eurecia.instance.defaults.headers.token, 'temporary-token');
      scope.done();
    });
  });

  describe('getCompanies', () => {
    it('should return the companies', async () => {
      const response = {
        data: ['company1', 'company2'],
      };
      const scope = nock(baseUrl)
        .get('/eurecia/rest/v4/companies')
        .matchHeader('Accept', 'application/json')
        .matchHeader('token', 'temporary-token')
        .reply(200, response);
      const companies = await eurecia.getCompanies();
      assert.deepStrictEqual(companies, response.data);
      scope.done();
    });
  });

  describe('getEmployees', () => {
    it('should return the employees', async () => {
      const response = {
        data: ['employee1', 'employee2'],
      };
      const scope = nock(baseUrl)
        .get('/eurecia/rest/v4/users/active?page=0')
        .matchHeader('Accept', 'application/json')
        .matchHeader('token', 'temporary-token')
        .reply(200, response);
      const employees = await eurecia.getEmployees();
      assert.deepStrictEqual(employees, response);
      scope.done();
    });
  });

  describe('getAllEmployees', () => {
    it('should return all the employees', async () => {
      const response1 = {
        content: ['employee1', 'employee2'],
        totalPages: 2,
      };
      const response2 = {
        content: ['employee3', 'employee4'],
      };
      const scope1 = nock(baseUrl)
        .get('/eurecia/rest/v4/users/active?page=0')
        .matchHeader('Accept', 'application/json')
        .matchHeader('token', 'temporary-token')
        .reply(200, response1);
      const scope2 = nock(baseUrl)
        .get('/eurecia/rest/v4/users/active?page=1')
        .matchHeader('Accept', 'application/json')
        .matchHeader('token', 'temporary-token')
        .reply(200, response2);
      const employees = await eurecia.getAllEmployees();
      assert.deepStrictEqual(employees, ['employee1', 'employee2', 'employee3', 'employee4']);
      scope1.done();
      scope2.done();
    });
  });

  describe('getEmployeeById', () => {
    it('should return the employee', async () => {
      const response = {
        data: 'employee',
      };
      const scope = nock(baseUrl)
        .get('/eurecia/rest/v4/users/1')
        .matchHeader('Accept', 'application/json')
        .matchHeader('token', 'temporary-token')
        .reply(200, response);
      const employee = await eurecia.getEmployeeById(1);
      assert.deepStrictEqual(employee, response);
      scope.done();
    });
  });

  describe('getDepartments', () => {
    it('should return the departments', async () => {
      const response = {
        data: ['department1', 'department2'],
      };
      const scope = nock(baseUrl)
        .get('/eurecia/rest/v4/departments')
        .matchHeader('Accept', 'application/json')
        .matchHeader('token', 'temporary-token')
        .reply(200, response);
      const departments = await eurecia.getDepartments();
      assert.deepStrictEqual(departments, response);
      scope.done();
    });
  });

  describe('getStructures', () => {
    it('should return the structures', async () => {
      const response = {
        data: ['structure1', 'structure2'],
      };
      const scope = nock(baseUrl)
        .get('/eurecia/rest/v4/structures')
        .matchHeader('Accept', 'application/json')
        .matchHeader('token', 'temporary-token')
        .reply(200, response);
      const structures = await eurecia.getStructures();
      assert.deepStrictEqual(structures, response);
      scope.done();
    });
  });

  describe('getPayrollGrids', () => {
    it('should return the payroll grids', async () => {
      const response = {
        data: ['payrollGrid1', 'payrollGrid2'],
      };
      const scope = nock(baseUrl)
        .get('/eurecia/rest/v4/payrollGrids')
        .matchHeader('Accept', 'application/json')
        .matchHeader('token', 'temporary-token')
        .reply(200, response);
      const payrollGrids = await eurecia.getPayrollGrids();
      assert.deepStrictEqual(payrollGrids, response);
      scope.done();
    });
  });
});
