const axios = require('axios');

class Eurecia {
  constructor() {
    this.BASE_URL = 'https://api.eurecia.com/eurecia/rest';
    this.instance = null;
  }

  async authenticate(token) {
    let response;
    try {
      response = await axios({
        method: 'get',
        url: 'https://api.eurecia.com/eurecia/rest/v1/Auth',
        headers: {
          Accept: 'application/json',
          authToken: token,
        },
      });
    } catch (error) {
      throw new Error('Invalid token (#1)');
    }
    if (response?.status !== 200) {
      throw new Error('Invalid token (#2)');
    }
    if (response.data.eureciaResponse?.temporaryToken?.token?.$ !== undefined) {
      this.instance = axios.create({
        baseURL: this.BASE_URL,
        headers: {
          Accept: 'application/json',
          token: response.data.eureciaResponse.temporaryToken.token.$,
        },
      });
    } else throw new Error('Invalid token (#3)');
  }

  async query(method, endpoint, data = null) {
    const response = await this.instance({
      method,
      url: endpoint,
      data,
    });
    return response.data;
  }

  async getCompanies(page = 0) {
    const response = await this.query('get', `/v4/companies?page=${page}`);
    return response;
  }

  async getAllCompanies() {
    const companies = [];
    let page = 0;
    const promises = [];
    promises.push(await this.getCompanies(page));
    page += 1;
    while (page < promises[0].totalPages) {
      promises.push(this.getCompanies(page));
      page += 1;
    }
    const responses = await Promise.all(promises);
    responses.forEach((res) => {
      res.content.forEach((company) => {
        companies.push(company);
      });
    });
    return companies;
  }

  async getEmployees(page = 0, active = true) {
    const response = await this.query(
      'get',
      `/v4/users${active === true ? '/active' : ''}?page=${page}`
    );
    return response;
  }

  async getAllEmployees(active = true) {
    const employees = [];
    let page = 0;
    const promises = [];
    promises.push(await this.getEmployees(page, active));
    page += 1;
    while (page < promises[0].totalPages) {
      promises.push(this.getEmployees(page, active));
      page += 1;
    }
    const responses = await Promise.all(promises);
    responses.forEach((res) => {
      res.content.forEach((employee) => {
        employees.push(employee);
      });
    });
    return employees;
  }

  async getEmployeeById(id) {
    const response = await this.query('get', `/v4/users/${id}`);
    return response;
  }

  async getDepartments() {
    const response = await this.query('get', `/v4/departments`);
    return response.nodes;
  }

  async getStructures() {
    const response = await this.query('get', `/v4/structures`);
    return response.nodes;
  }

  async getPayrollGrids() {
    const response = await this.query('get', `/v4/payrollGrids`);
    return response;
  }
}

module.exports = Eurecia;
