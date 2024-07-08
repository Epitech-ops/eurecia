import axios, { AxiosInstance, AxiosResponse } from 'axios';
import {
  Company,
  Departments,
  Employee,
  List,
  Structures,
  VacationAccumulation,
  EureciaResponse,
} from './@types/index';

class Eurecia {
  private BASE_URL: string;

  private instance: AxiosInstance | null;

  constructor() {
    this.BASE_URL = 'https://api.eurecia.com/eurecia/rest';
    this.instance = null;
  }

  async authenticate(token: string): Promise<void> {
    let response: AxiosResponse<EureciaResponse>;
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

  private async query<T>(method: string, endpoint: string, data: any = null): Promise<T> {
    const response = await this.instance!({
      method,
      url: endpoint,
      data,
    });
    return response.data;
  }

  getCompanies(page = 0): Promise<List<Company>> {
    const response = this.query<List<Company>>('get', `/v4/companies?page=${page}`);
    return response;
  }

  async getAllCompanies(): Promise<Company[]> {
    const companies: Company[] = [];
    let page = 0;
    const promises: Promise<List<Company>>[] = [];
    const firstPage = await this.getCompanies(page);
    const pages = firstPage.totalPages;
    page += 1;
    while (page < pages) {
      promises.push(this.getCompanies(page));
      page += 1;
    }
    companies.push(...firstPage.content);
    const responses = await Promise.all(promises);
    responses.forEach((res) => {
      res.content.forEach((company) => {
        companies.push(company);
      });
    });
    return companies;
  }

  getEmployees(page = 0, active = true): Promise<List<Employee>> {
    const response = this.query<List<Employee>>(
      'get',
      `/v4/users${active === true ? '/active' : ''}?page=${page}`
    );
    return response;
  }

  async getAllEmployees(active = true): Promise<Employee[]> {
    const employees: Employee[] = [];
    let page = 0;
    const promises: Promise<List<Employee>>[] = [];
    const firstPage = await this.getEmployees(page, active);
    const pages = firstPage.totalPages;
    page += 1;
    while (page < pages) {
      promises.push(this.getEmployees(page, active));
      page += 1;
    }
    employees.push(...firstPage.content);
    const responses = await Promise.all(promises);
    responses.forEach((res) => {
      res.content.forEach((employee) => {
        employees.push(employee);
      });
    });
    return employees;
  }

  async getEmployeeById(id: string): Promise<Employee> {
    const response = await this.query<Employee>('get', `/v4/users/${id}`);
    return response;
  }

  async getDepartments(): Promise<Departments> {
    const response = await this.query<Departments>('get', `/v4/departments`);
    return response;
  }

  async getStructures(): Promise<Structures> {
    const response = await this.query<Structures>('get', `/v4/structures`);
    return response;
  }

  // async getPayrollGrids(): Promise<any> {
  //   const response = await this.query<any>('get', `/v1/payrollGrids`);
  //   return response;
  // }

  async getVacationAccumulationForUser(id: string): Promise<VacationAccumulation> {
    const response = await this.query<VacationAccumulation>(
      'get',
      `/v1/VacationAccumulation?userId=${id}`
    );
    return response;
  }
}

export { Eurecia };
