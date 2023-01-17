export type RedirectType = 'URL' | 'REGEXSUBSTITUTION' | 'EXTENSIONPATH';
export type FilterType = 'URLFILTER' | 'REGEXFILTER';

export class MyRule implements chrome.declarativeNetRequest.Rule {
  action!: chrome.declarativeNetRequest.RuleAction;
  condition!: chrome.declarativeNetRequest.RuleCondition;
  id!: number;
  priority?: number | undefined;
  redirectType?: RedirectType | undefined;
  filterType?: FilterType | undefined;
}

export type Action = 
  {
    target: 'ALL';
    rules: MyRule[];
  } |
  {
    id: number;
    target: 'DELETE';
  } |
  {
    target: 'ADDEMPTY';
  } |
  {
    id: number;
    target: 'PRIORITY';
    priority: number | undefined;
  } |
  {
    id: number;
    target: 'REDIRECTTYPE';
    redirectType: RedirectType | undefined;
  } |
  {
    id: number;
    target: 'ACTIONTYPE';
    actionType: chrome.declarativeNetRequest.RuleActionType;
  } |
  {
    id: number;
    target: 'EXTENSIONPATH';
    extensionPath: string | undefined;
  } |
  {
    id: number;
    target: 'REGEXSUBSTITUTION';
    regexSubstitution: string | undefined;
  } |
  {
    id: number;
    target: 'URL';
    url: string | undefined;
  } |
  {
    id: number;
    target: 'DOMAINTYPE';
    domainType: chrome.declarativeNetRequest.DomainType | undefined;
  } |
  {
    id: number;
    target: 'INITIATORDOMAINS';
    initiatorDomains: string[] | undefined;
  } |
  {
    id: number;
    target: 'EXCLUDEDINITIATORDOMAINS';
    excludedInitiatorDomains: string[] | undefined;
  } |
  {
    id: number;
    target: 'REQUESTDOMAINS';
    requestDomains: string[] | undefined;
  } |
  {
    id: number;
    target: 'EXCLUDEDREQUESTDOMAINS';
    excludedRequestDomains: string[] | undefined;
  } |
  {
    id: number;
    target: 'REQUESTMETHODS';
    requestMethods: chrome.declarativeNetRequest.RequestMethod[] | undefined;
  } |
  {
    id: number;
    target: 'EXCLUDEDREQUESTMETHODS';
    excludedRequestMethods: chrome.declarativeNetRequest.RequestMethod[] | undefined;
  } |
  {
    id: number;
    target: 'RESOURCETYPES';
    resourceTypes: chrome.declarativeNetRequest.ResourceType[] | undefined;
  } |
  {
    id: number;
    target: 'EXCLUDEDRESOURCETYPES';
    excludedResourceTypes: chrome.declarativeNetRequest.ResourceType[] | undefined;
  } |
  {
    id: number;
    target: 'REGEXFILTER';
    regexFilter: string | undefined;
  } |
  {
    id: number;
    target: 'URLFILTER';
    urlFilter: string | undefined;
  } |
  {
    id: number;
    target: 'FILTERTYPE';
    filterType: FilterType | undefined;
  }
;

export type Status = {
  status: 'SUCCESSED' | 'ERROR' | undefined;
  message: string | undefined;
};