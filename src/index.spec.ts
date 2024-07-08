const assert = require('assert');
import axios from 'axios';
const nock = require('nock');
import {
  Company,
  Departments,
  Employee,
  EureciaResponse,
  List,
  Structures,
  VacationAccumulation,
} from './@types';
import { Eurecia } from './index';

describe('Eurecia', () => {
  const baseUrl = 'https://api.eurecia.com';
  let eurecia: any;
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
      } catch (error: any) {
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
      } catch (error: any) {
        assert.strictEqual(error.message, 'Invalid token (#2)');
        scope.done();
      }
    });

    it('should throw an error for an invalid returned object', async () => {
      const response: EureciaResponse = {
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
      } catch (error: any) {
        assert.strictEqual(error.message, 'Invalid token (#3)');
        scope.done();
      }
    });

    it('should set the instance with the correct token', async () => {
      const response: EureciaResponse = {
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
      const response: List<Company> = {
        content: [
          {
            id: 'Company 1',
            descr: "Company 1's name",
            dateCreate: 1684338245000,
          },
          {
            id: 'Company 2',
            descr: "Company 2's name",
            dateCreate: 1684330000000,
          },
        ],
        pageable: 'INSTANCE',
        totalElements: 2,
        totalPages: 1,
        last: true,
        number: 0,
        sort: {
          empty: true,
          sorted: false,
          unsorted: true,
        },
        size: 2,
        numberOfElements: 2,
        first: true,
        empty: false,
      };
      const scope = nock(baseUrl)
        .get('/eurecia/rest/v4/companies?page=0')
        .matchHeader('Accept', 'application/json')
        .matchHeader('token', 'temporary-token')
        .reply(200, response);
      const companies: Promise<List<Company>> = await eurecia.getCompanies();
      assert.deepStrictEqual(companies, response);
      scope.done();
    });
  });

  describe('getAllCompanies', () => {
    it('should return all the companies', async () => {
      const response1: List<Company> = {
        content: [
          {
            id: 'Company 1',
            descr: "Company 1's name",
            dateCreate: 1684338245000,
          },
          {
            id: 'Company 2',
            descr: "Company 2's name",
            dateCreate: 1684330000000,
          },
        ],
        pageable: 'INSTANCE',
        totalElements: 4,
        totalPages: 2,
        last: false,
        number: 0,
        sort: {
          empty: true,
          sorted: false,
          unsorted: true,
        },
        size: 4,
        numberOfElements: 2,
        first: true,
        empty: false,
      };
      const response2: List<Company> = {
        content: [
          {
            id: 'Company 3',
            descr: "Company 3's name",
            dateCreate: 1684338245000,
          },
          {
            id: 'Company 4',
            descr: "Company 4's name",
            dateCreate: 1684330000000,
          },
        ],
        pageable: 'INSTANCE',
        totalElements: 4,
        totalPages: 2,
        last: true,
        number: 0,
        sort: {
          empty: true,
          sorted: false,
          unsorted: true,
        },
        size: 4,
        numberOfElements: 2,
        first: false,
        empty: false,
      };
      const scope1 = nock(baseUrl)
        .get('/eurecia/rest/v4/companies?page=0')
        .matchHeader('Accept', 'application/json')
        .matchHeader('token', 'temporary-token')
        .reply(200, response1);
      const scope2 = nock(baseUrl)
        .get('/eurecia/rest/v4/companies?page=1')
        .matchHeader('Accept', 'application/json')
        .matchHeader('token', 'temporary-token')
        .reply(200, response2);
      const companies = await eurecia.getAllCompanies();
      assert.deepStrictEqual(companies, [
        response1.content[0],
        response1.content[1],
        response2.content[0],
        response2.content[1],
      ]);
      scope1.done();
      scope2.done();
    });
  });

  describe('getEmployees', () => {
    it('should return the employees', async () => {
      const response: List<Employee> = {
        content: [
          {
            id: 'ID1',
            email: 'user1@mail.com',
            firstName: 'John',
            lastName: 'Doe',
            jobTitle: 'Manager',
            department: 'dept1',
            structure: 'struct1',
          },
          {
            id: 'ID2',
            email: 'user2@mail.com',
            firstName: 'Jane',
            lastName: 'Doe',
            jobTitle: 'Employee',
            department: 'dept2',
            structure: 'struct1',
          },
        ],
        pageable: {
          sort: {
            empty: true,
            sorted: false,
            unsorted: true,
          },
          offset: 0,
          pageNumber: 0,
          pageSize: 50,
          paged: true,
          unpaged: false,
        },
        totalElements: 2,
        totalPages: 1,
        last: true,
        number: 0,
        sort: {
          empty: true,
          sorted: false,
          unsorted: true,
        },
        size: 2,
        numberOfElements: 2,
        first: true,
        empty: false,
      };
      const scope = nock(baseUrl)
        .get('/eurecia/rest/v4/users/active?page=0')
        .matchHeader('Accept', 'application/json')
        .matchHeader('token', 'temporary-token')
        .reply(200, response);
      const employees: Promise<List<Employee>> = await eurecia.getEmployees();
      assert.deepStrictEqual(employees, response);
      scope.done();
    });
    it('should return the employees', async () => {
      const response: List<Employee> = {
        content: [
          {
            id: 'ID1',
            email: 'user1@mail.com',
            firstName: 'John',
            lastName: 'Doe',
            jobTitle: 'Manager',
            department: 'dept1',
            structure: 'struct1',
          },
          {
            id: 'ID2',
            email: 'user2@mail.com',
            firstName: 'Jane',
            lastName: 'Doe',
            jobTitle: 'Employee',
            department: 'dept2',
            structure: 'struct1',
          },
        ],
        pageable: {
          sort: {
            empty: true,
            sorted: false,
            unsorted: true,
          },
          offset: 0,
          pageNumber: 0,
          pageSize: 50,
          paged: true,
          unpaged: false,
        },
        totalElements: 2,
        totalPages: 1,
        last: true,
        number: 0,
        sort: {
          empty: true,
          sorted: false,
          unsorted: true,
        },
        size: 2,
        numberOfElements: 2,
        first: true,
        empty: false,
      };
      const scope = nock(baseUrl)
        .get('/eurecia/rest/v4/users?page=0')
        .matchHeader('Accept', 'application/json')
        .matchHeader('token', 'temporary-token')
        .reply(200, response);
      const employees: Promise<List<Employee>> = await eurecia.getEmployees(0, false);
      assert.deepStrictEqual(employees, response);
      scope.done();
    });
  });

  describe('getAllEmployees', () => {
    it('should return all the employees', async () => {
      const response1: List<Employee> = {
        content: [
          {
            id: 'ID1',
            email: 'user1@mail.com',
            firstName: 'John',
            lastName: 'Doe',
            jobTitle: 'Manager',
            department: 'dept1',
            structure: 'struct1',
          },
          {
            id: 'ID2',
            email: 'user2@mail.com',
            firstName: 'Jane',
            lastName: 'Doe',
            jobTitle: 'Employee',
            department: 'dept2',
            structure: 'struct1',
          },
        ],
        pageable: {
          sort: {
            empty: true,
            sorted: false,
            unsorted: true,
          },
          offset: 0,
          pageNumber: 0,
          pageSize: 2,
          paged: true,
          unpaged: false,
        },
        totalElements: 4,
        totalPages: 2,
        last: true,
        number: 0,
        sort: {
          empty: true,
          sorted: false,
          unsorted: true,
        },
        size: 2,
        numberOfElements: 2,
        first: true,
        empty: false,
      };
      const response2: List<Employee> = {
        content: [
          {
            id: 'ID3',
            email: 'user3@mail.com',
            firstName: 'Bob',
            lastName: 'Johnson',
            jobTitle: 'Developer',
            department: 'dept1',
            structure: 'struct2',
          },
          {
            id: 'ID4',
            email: 'user4@mail.com',
            firstName: 'Alice',
            lastName: 'Smith',
            jobTitle: 'Sales',
            department: 'dept2',
            structure: 'struct2',
          },
        ],
        pageable: {
          sort: {
            empty: true,
            sorted: false,
            unsorted: true,
          },
          offset: 2,
          pageNumber: 1,
          pageSize: 2,
          paged: true,
          unpaged: false,
        },
        totalElements: 4,
        totalPages: 2,
        last: true,
        number: 0,
        sort: {
          empty: true,
          sorted: false,
          unsorted: true,
        },
        size: 2,
        numberOfElements: 2,
        first: true,
        empty: false,
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
      assert.deepStrictEqual(employees, [
        response1.content[0],
        response1.content[1],
        response2.content[0],
        response2.content[1],
      ]);
      scope1.done();
      scope2.done();
    });
  });

  describe('getEmployeeById', () => {
    it('should return the employee', async () => {
      const response: Employee = {
        id: 'ID1',
        email: 'user1@mail.com',
        firstName: 'John',
        lastName: 'Doe',
        jobTitle: 'Manager',
        department: 'dept1',
        structure: 'struct1',
        refNumber: '4242',
        gender: 'Mr',
        phones: [],
        socialSecurityNum: '1 23 45 67 123 456',
        birthdayDate: 268000000000,
        birthdayCity: 'Paris',
        addresses: {
          main: {
            num: '',
            repetition: 'EMPTY',
            roadName: '',
            address1: '1 rue de Paris',
            zipCode: '75001',
            city: 'Paris',
            country: null,
            state: null,
          },
        },
        personalEmail: 'personal@mail.com',
        nationality: 'FR',
        entryDate: 1704668400000,
        seniorityDate: 1704668400000,
        seniorityShift: 0,
        hiringDate: 1704668400000,
        departureDate: 1722031200000,
        workContract: 'cdi',
        professionalStatus: 'manager',
        qualification: 'IT',
        coefficient: 'CA1',
        workingTimeRate: 100.0,
        workingTimeUnit: 'day',
        yearWorkingTime: 212,
        activityType: 'full',
        legalHolidaysCalendar: 'calendarId',
        userSequences: [],
        userManagers: [],
        annualGrossSalary: 1337.0,
        monthlyGrossSalary: 42.0,
        mealVoucherIsActive: true,
        benefits1: 'abc.de',
        benefits3: 'Working staff',
        benefits4: 'lundi au vendredi',
        benefits5: '5',
        benefits6: '42.00',
        userDirectManagers: ['ID0'],
        otherAccount: '',
        otherAccount2: '',
        additionalField1: 'Field 1',
        additionalField2: 'Field 2',
        flagHasACar: false,
        flagHasAFuelCard: false,
        transportMode: '',
        vacationProfile: 'vacationProfileId1',
        reimbursementProfiles: [],
        userProfile: 'userProfileId1',
        dateEndAccess: 32503676400000,
        hasLogin: true,
        flagOptOutEmail: false,
        flagControlAccess: true,
        idModules: '1[.]3[.]8[.]5',
        feedDelegation: false,
        ideaDelegation: false,
        modelDelegation: false,
        modelUsage: false,
        hasOcr: true,
        userCreate: 'User create comment',
        dateCreate: 1705502721000,
        userUpdate: 'User update comment',
        dateUpdate: 1719582852000,
        timezone: 'Europe/Paris',
        locale: 'fr_FR',
        displayImputationStructureInOneColumn: false,
        sendICalVacationRequest: false,
        sendICalVacationRequestOtherUser: false,
        _embedded: {
          userSequences: [],
          userDirectManagers: [
            {
              id: 'ID0',
              email: 'big.boss@company.com',
              firstName: 'Big',
              lastName: 'Boss',
            },
          ],
          reimbursementProfiles: [],
        },
        archived: false,
        userIncludedInEVP: true,
        admin: false,
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
      const response: Departments = {
        nodes: [
          {
            organizationDto: {
              id: 'ID1',
              name: 'Department 1',
              type: 'DEPARTMENT',
              typeLabel: 'Département',
            },
            nodes: [],
          },
          {
            organizationDto: {
              id: 'ID2',
              name: 'Department 2',
              type: 'DEPARTMENT',
              typeLabel: 'Département',
            },
            nodes: [],
          },
        ],
      };
      const scope = nock(baseUrl)
        .get('/eurecia/rest/v4/departments')
        .matchHeader('Accept', 'application/json')
        .matchHeader('token', 'temporary-token')
        .reply(200, response);
      const departments: Promise<Departments> = await eurecia.getDepartments();
      assert.deepStrictEqual(departments, response);
      scope.done();
    });
  });

  describe('getStructures', () => {
    it('should return the structures', async () => {
      const response: Structures = {
        nodes: [
          {
            organizationDto: {
              id: 'ID1',
              name: 'Structure 1',
              type: 'STRUCTURE',
              typeLabel: 'Structure',
            },
            nodes: [],
          },
          {
            organizationDto: {
              id: 'ID2',
              name: 'Structure 2',
              type: 'STRUCTURE',
              typeLabel: 'Structure',
            },
            nodes: [],
          },
        ],
      };
      const scope = nock(baseUrl)
        .get('/eurecia/rest/v4/structures')
        .matchHeader('Accept', 'application/json')
        .matchHeader('token', 'temporary-token')
        .reply(200, response);
      const structures: Promise<Structures> = await eurecia.getStructures();
      assert.deepStrictEqual(structures, response);
      scope.done();
    });
  });

  // describe('getPayrollGrids', () => {
  //   it('should return the payroll grids', async () => {
  //     const response = {
  //       data: ['payrollGrid1', 'payrollGrid2'],
  //     };
  //     const scope = nock(baseUrl)
  //       .get('/eurecia/rest/v4/payrollGrids')
  //       .matchHeader('Accept', 'application/json')
  //       .matchHeader('token', 'temporary-token')
  //       .reply(200, response);
  //     const payrollGrids = await eurecia.getPayrollGrids();
  //     assert.deepStrictEqual(payrollGrids, response);
  //     scope.done();
  //   });
  // });

  describe('getVacationAccumulationForUser', () => {
    it('should return the vacation accumulation for the user', async () => {
      const response: VacationAccumulation = {
        eureciaResponse: {
          totalElementsFound: {
            $: '5498',
          },
          startPadding: {
            $: '0',
          },
          endPadding: {
            $: '50',
          },
          list: {
            item: [
              {
                '@xmlns': {
                  xsi: 'http://www.w3.org/2001/XMLSchema-instance',
                },
                '@xsi:type': 'vacationAccumulation',
                userCreate: {
                  $: 'cron@eurecia.com',
                },
                dateCreate: {
                  $: '2024-06-01T03:04:23+02:00',
                },
                userUpdate: {
                  $: 'increaseAccumulations@eurecia.com',
                },
                dateUpdate: {
                  $: '2024-07-01T03:11:21+02:00',
                },
                id: {
                  idCompany: {
                    $: 'COMPANYID1',
                  },
                  idUser: {
                    $: 'USERID1',
                  },
                  idAccumulation: {
                    $: 'ACCUMULATIONID1',
                  },
                  idVacationType: {
                    $: 'VACATIONTYPEID1',
                  },
                  idCompanyType: {
                    $: 'COMPANYTYPEID1',
                  },
                  yearOfEnd: {
                    $: '2025',
                  },
                },
                nbCumulatedUnits: {
                  $: '5.0',
                },
                nbUsedUnits: {
                  $: '0.0',
                },
                nbLostUnits: {
                  $: '0.0',
                },
                nbUnworkedDaysToTake: {
                  $: '0.0',
                },
                accumulationTrackings: {
                  accumulationTracking: [
                    {
                      idVacationAccumulationTracking: {
                        $: 'VACATIONACCUMULATIONTRACKINGID1',
                      },
                      modificationDate: {
                        $: '2024-06-01T00:00:00+02:00',
                      },
                      description: {
                        $: 'Init',
                      },
                      cumulatedDays: {
                        $: '0.0',
                      },
                      takenDays: {
                        $: '0.0',
                      },
                      unworkedDays: {
                        $: '0.0',
                      },
                      lostUnits: {
                        $: '0.0',
                      },
                      timeUnit: {
                        $: 'days',
                      },
                      actor: {
                        $: 'increaseAccumulations@eurecia.com',
                      },
                    },
                    {
                      idVacationAccumulationTracking: {
                        $: 'VACATIONACCUMULATIONTRACKINGID2',
                      },
                      modificationDate: {
                        $: '2024-06-01T00:00:00+02:00',
                      },
                      description: {
                        $: 'juin',
                      },
                      cumulatedDays: {
                        $: '2.5',
                      },
                      takenDays: {
                        $: '0.0',
                      },
                      unworkedDays: {
                        $: '0.0',
                      },
                      lostUnits: {
                        $: '0.0',
                      },
                      timeUnit: {
                        $: 'days',
                      },
                      actor: {
                        $: 'increaseAccumulations@eurecia.com',
                      },
                    },
                    {
                      idVacationAccumulationTracking: {
                        $: 'VACATIONACCUMULATIONTRACKINGID3',
                      },
                      modificationDate: {
                        $: '2024-07-01T00:00:00+02:00',
                      },
                      description: {
                        $: 'juillet',
                      },
                      cumulatedDays: {
                        $: '2.5',
                      },
                      takenDays: {
                        $: '0.0',
                      },
                      unworkedDays: {
                        $: '0.0',
                      },
                      lostUnits: {
                        $: '0.0',
                      },
                      timeUnit: {
                        $: 'days',
                      },
                      actor: {
                        $: 'increaseAccumulations@eurecia.com',
                      },
                    },
                  ],
                },
              },
            ],
          },
        },
      };
      const scope = nock(baseUrl)
        .get('/eurecia/rest/v1/VacationAccumulation?userId=USERID1')
        .matchHeader('Accept', 'application/json')
        .matchHeader('token', 'temporary-token')
        .reply(200, response);
      const vacationAccumulation = await eurecia.getVacationAccumulationForUser('USERID1');
      assert.deepStrictEqual(vacationAccumulation, response);
      scope.done();
    });
  });
});
