interface EureciaResponse {
  eureciaResponse: {
    temporaryToken: {
      token: {
        $?: string;
      };
    };
  };
}

interface List<T> {
  content: T[];
  pageable:
    | string
    | {
        sort: {
          empty: boolean;
          sorted: boolean;
          unsorted: boolean;
        };
        offset: number;
        pageNumber: number;
        pageSize: number;
        paged: boolean;
        unpaged: boolean;
      };
  totalElements: number;
  totalPages: number;
  last: boolean;
  number: number;
  sort: {
    empty: boolean;
    sorted: boolean;
    unsorted: boolean;
  };
  size: number;
  numberOfElements: number;
  first: boolean;
  empty: boolean;
}

type EntityType = 'DEPARTMENT' | 'STRUCTURE';
type EntityTypeLabel = 'Département' | 'Structure';

interface Node<Entity, EntityLabel> {
  organizationDto: {
    id: string;
    name: string;
    type: Entity;
    typeLabel: EntityLabel;
  };
  nodes: Node<Entity, EntityLabel>[];
}

interface Departments {
  nodes: Node<'DEPARTMENT', 'Département'>[];
}

interface Structures {
  nodes: Node<'STRUCTURE', 'Structure'>[];
}

interface Company {
  id: string;
  descr: string;
  dateCreate: number;
}

interface Phone {
  id: string;
  type: string;
  number: string;
  ownerName: string;
  typeLabel: string | null;
}

interface Address {
  num: string | null;
  repetition: string;
  roadName: string | null;
  address1: string;
  zipCode: string;
  city: string;
  country: string | null;
  state: string | null;
}

interface Manager {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
}

interface Employee {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  jobTitle: string;
  department: string;
  structure: string;
  refNumber?: string;
  gender?: string;
  phones?: Phone[];
  socialSecurityNum?: string;
  birthdayDate?: number;
  birthdayCity?: string;
  addresses?: {
    main?: Address;
  };
  personalEmail?: string;
  nationality?: string;
  matrialStatus?: string;
  entryDate?: number;
  seniorityDate?: number;
  seniorityShift?: number;
  hiringDate?: number;
  departureDate?: number;
  workContract?: string;
  professionalStatus?: string;
  qualification?: string;
  coefficient?: string;
  workingTimeRate?: number;
  workingTimeUnit?: string;
  monthlyWorkingTime?: number;
  yearWorkingTime?: number;
  activityType?: string;
  legalHolidaysCalendar?: string;
  userSequences?: string[];
  userManagers?: any[];
  annualGrossSalary?: number;
  monthlyGrossSalary?: number;
  mealVoucherIsActive?: boolean;
  benefits1?: string;
  benefits3?: string;
  benefits4?: string;
  benefits5?: string;
  benefits6?: string;
  userDirectManagers?: string[];
  analyticCodeSuffix?: string;
  otherAccount?: string;
  otherAccount2?: string;
  additionalField1?: string;
  additionalField2?: string;
  additionalField3?: string;
  flagHasACar?: boolean;
  flagHasAFuelCard?: boolean;
  transportMode?: string;
  vacationProfile?: string;
  reimbursementProfiles?: any[];
  reimbursementCurrency?: string;
  timeSheetProfile?: string;
  userProfile?: string;
  dateEndAccess?: number;
  hasLogin?: boolean;
  flagOptOutEmail?: boolean;
  flagControlAccess?: boolean;
  idModules?: string;
  feedDelegation?: boolean;
  ideaDelegation?: boolean;
  modelDelegation?: boolean;
  modelUsage?: boolean;
  hasOcr?: boolean;
  userCreate?: string;
  dateCreate?: number;
  userUpdate?: string;
  dateUpdate?: number;
  timezone?: string;
  locale?: string;
  displayImputationStructureInOneColumn?: boolean;
  sendICalVacationRequest?: boolean;
  sendICalVacationRequestOtherUser?: boolean;
  userCurrency?: string;
  _embedded?: {
    userSequences?: { id?: string }[];
    userDirectManagers?: Manager[];
    reimbursementProfiles?: any[];
  };
  archived?: boolean;
  userIncludedInEVP?: boolean;
  admin?: boolean;
}

interface DollarString {
  $: string;
}

interface VacationAccumulation {
  eureciaResponse: {
    totalElementsFound: DollarString;
    startPadding: DollarString;
    endPadding: DollarString;
    list: {
      item: [
        {
          '@xmlns': {
            xsi: string;
            xsd?: string;
          };
          '@xsi:type': string;
          userCreate: DollarString;
          dateCreate: DollarString;
          userUpdate: DollarString;
          dateUpdate: DollarString;
          id: {
            idCompany: DollarString;
            idUser: DollarString;
            idAccumulation: DollarString;
            idVacationType: DollarString;
            idCompanyType: DollarString;
            yearOfEnd: DollarString;
          };
          nbCumulatedUnits: DollarString;
          nbUsedUnits: DollarString;
          nbLostUnits: DollarString;
          nbUnworkedDaysToTake: DollarString;
          accumulationTrackings: {
            accumulationTracking: {
              idVacationAccumulationTracking: DollarString;
              modificationDate: DollarString;
              description: DollarString;
              cumulatedDays: DollarString;
              takenDays: DollarString;
              unworkedDays: DollarString;
              lostUnits: DollarString;
              timeUnit: DollarString;
              actor: DollarString;
            }[];
          };
        },
      ];
    };
  };
}

export {
  EureciaResponse,
  List,
  EntityType,
  EntityTypeLabel,
  Departments,
  Structures,
  Company,
  Phone,
  Address,
  Manager,
  Employee,
  VacationAccumulation,
};
