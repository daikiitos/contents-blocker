import { 
  Container, 
  Box, 
  Grid, 
  Typography, 
  TextField, 
  Select, 
  MenuItem, 
  Button,
  FormControl,
  Hidden,
} from '@mui/material';
import React, {useState, useEffect, useReducer, ReactNode} from 'react';
import ReactDOM from 'react-dom/client';
import './options.css';

class MyRule implements chrome.declarativeNetRequest.Rule {
  action!: chrome.declarativeNetRequest.RuleAction;
  condition!: chrome.declarativeNetRequest.RuleCondition;
  id!: number;
  priority?: number | undefined;
  redirectType?: RedirectType | undefined;
}

type RedirectType = 'URL' | 'REGEXSUBSTITUTION' | 'EXTENSIONPATH';

type Action = 
  {
    target: 'ALL';
    rules: MyRule[];
  } |
  {
    target: 'ADDEMPTY';
  } |
  {
    id: number;
    target: 'PRIORITY';
    priority: number;
  } |
  {
    id: number;
    target: 'REDIRECTTYPE';
    redirectType: RedirectType;
  } |
  {
    id: number;
    target: 'ACTIONTYPE';
    actionType: chrome.declarativeNetRequest.RuleActionType;
  } |
  {
    id: number;
    target: 'EXTENSIONPATH';
    extensionPath: string;
  } |
  {
    id: number;
    target: 'REGEXSUBSTITUTION';
    regexSubstitution: string;
  } |
  {
    id: number;
    target: 'URL';
    url: string;
  } |
  {
    id: number;
    target: 'DOMAINTYPE';
    domainType: chrome.declarativeNetRequest.DomainType;
  } |
  {
    id: number;
    target: 'INITIATORDOMAINS';
    initiatorDomains: string[];
  } |
  {
    id: number;
    target: 'EXCLUDEDINITIATORDOMAINS';
    excludedInitiatorDomains: string[];
  } |
  {
    id: number;
    target: 'REQUESTDOMAINS';
    requestDomains: string[];
  } |
  {
    id: number;
    target: 'EXCLUDEDREQUESTDOMAINS';
    excludedRequestDomains: string[];
  } |
  {
    id: number;
    target: 'REQUESTMETHODS';
    requestMethods: chrome.declarativeNetRequest.RequestMethod[];
  } |
  {
    id: number;
    target: 'EXCLUDEDREQUESTMETHODS';
    excludedRequestMethods: chrome.declarativeNetRequest.RequestMethod[];
  } |
  {
    id: number;
    target: 'RESOURCETYPES';
    resourceTypes: chrome.declarativeNetRequest.ResourceType[];
  } |
  {
    id: number;
    target: 'EXCLUDEDRESOURCETYPES';
    excludedResourceTypes: chrome.declarativeNetRequest.ResourceType[];
  } |
  {
    id: number;
    target: 'REGEXFILTER';
    regexFilter: string;
  } |
  {
    id: number;
    target: 'URLFILTER';
    urlFilter: string;
  } 
;

const initialState: MyRule[] = [];

const reducer = (state: MyRule[], act: Action) => {
  switch (act.target) {
    case 'ALL':
      return act.rules;
    case 'ADDEMPTY':
      return [...state, {
        id: state.length == 0 ? 1 : state.slice(-1)[0].id + 1,
        priority: 1,
        action: {type: chrome.declarativeNetRequest.RuleActionType.BLOCK},
        condition: {}
      }];
    case 'REDIRECTTYPE':
      return state.map((rule) => (
        rule.id == act.id ? {
          ...rule, 
          redirectType: act.redirectType, 
          action: {...(rule.action), redirect: {
            ...(rule.action.redirect), 
            url: act.redirectType == 'URL' as RedirectType ? (rule.action.redirect?.url ?? '') : undefined,
            regexSubstitution: act.redirectType == 'REGEXSUBSTITUTION' as RedirectType ? (rule.action.redirect?.regexSubstitution ?? '') : undefined,
            extensionPath: act.redirectType == 'EXTENSIONPATH' as RedirectType ? (rule.action.redirect?.extensionPath ?? '') : undefined,
          }}} : rule
      ));
    case 'PRIORITY':
      return state.map((rule) => (
        rule.id == act.id ? {...rule, priority: act.priority} : rule
      ));
    case 'ACTIONTYPE':
      return state.map((rule) => (
        rule.id == act.id ? {
          ...rule, 
          action: {...(rule.action), type: act.actionType, redirect: {
            ...(rule.action.redirect), 
            url: act.actionType == chrome.declarativeNetRequest.RuleActionType.REDIRECT ? (rule.action.redirect?.url ?? '') : undefined
          }}, 
          redirectType: act.actionType == chrome.declarativeNetRequest.RuleActionType.REDIRECT ? (rule.redirectType ?? 'URL' as RedirectType) : undefined
        } : rule
      ));
    case 'EXTENSIONPATH':
      return state.map((rule) => (
        rule.id == act.id ? {...rule, action: {...(rule.action), redirect: {...(rule.action.redirect), extensionPath: act.extensionPath}}} : rule
      ));
    case 'REGEXSUBSTITUTION':
      return state.map((rule) => (
        rule.id == act.id ? {...rule, action: {...(rule.action), redirect: {...(rule.action.redirect), regexSubstitution: act.regexSubstitution}}} : rule
      ));
    case 'URL':
      return state.map((rule) => (
        rule.id == act.id ? {...rule, action: {...(rule.action), redirect: {...(rule.action.redirect), url: act.url}}} : rule
      ));
    case 'DOMAINTYPE':
      return state.map((rule) => (
        rule.id == act.id ? {...rule, condition: {...(rule.condition), domainType: act.domainType}} : rule
      ));
    case 'INITIATORDOMAINS':
      return state.map((rule) => (
        rule.id == act.id ? {...rule, condition: {...(rule.condition), initiatorDomains: act.initiatorDomains}} : rule
      ));
    case 'EXCLUDEDINITIATORDOMAINS':
      return state.map((rule) => (
        rule.id == act.id ? {...rule, condition: {...(rule.condition), excludedInitiatorDomains: act.excludedInitiatorDomains}} : rule
      ));
    case 'REQUESTDOMAINS':
      return state.map((rule) => (
        rule.id == act.id ? {...rule, condition: {...(rule.condition), requestDomains: act.requestDomains}} : rule
      ));
    case 'EXCLUDEDREQUESTDOMAINS':
      return state.map((rule) => (
        rule.id == act.id ? {...rule, condition: {...(rule.condition), excludedRequestDomains: act.excludedRequestDomains}} : rule
      ));
    case 'REQUESTMETHODS':
      return state.map((rule) => (
        rule.id == act.id ? {...rule, condition: {...(rule.condition), requestMethods: act.requestMethods}} : rule
      ));
    case 'EXCLUDEDREQUESTMETHODS':
      return state.map((rule) => (
        rule.id == act.id ? {...rule, condition: {...(rule.condition), excludedRequestMethods: act.excludedRequestMethods}} : rule
      ));
    case 'RESOURCETYPES':
      return state.map((rule) => (
        rule.id == act.id ? {...rule, condition: {...(rule.condition), resourceTypes: act.resourceTypes}} : rule
      ));
    case 'EXCLUDEDRESOURCETYPES':
      return state.map((rule) => (
        rule.id == act.id ? {...rule, condition: {...(rule.condition), excludedResourceTypes: act.excludedResourceTypes}} : rule
      ));
    case 'REGEXFILTER':
      return state.map((rule) => (
        rule.id == act.id ? {...rule, condition: {...(rule.condition), regexFilter: act.regexFilter}} : rule
      ));
    case 'URLFILTER':
      return state.map((rule) => (
        rule.id == act.id ? {...rule, condition: {...(rule.condition), urlFilter: act.urlFilter}} : rule
      ));
    default:
      return state;
  }
};

const Main = () => {
  // action, condition, id, priority?
  // const [ruleState, setRuleState] = useState<MyRule[]>([]);
  const [ruleState, dispatch] = useReducer(reducer, initialState);
  const [status, setStatus] = useState<string>('');

  useEffect(() => {
    chrome.declarativeNetRequest.getDynamicRules(rules => {
      // Set state
      dispatch({target: 'ALL', rules: rules});
    });
  }, []);

  const upDateRules = () => {
    chrome.declarativeNetRequest.updateDynamicRules(
      {
        removeRuleIds: ruleState.map(rule => rule.id),
        addRules: ruleState
      },
      () => {
        if (chrome.runtime.lastError) {
          setStatus(chrome.runtime.lastError.message!);
        } else {
          setStatus('Rules updated.');
        }
      }
    );
  };

  return (
    <Container>
      {ruleState.map((rule, index) => {
        return (
          <Box
            key={index}
            sx={{
              p: 2,
              m: 2,
              border: 1,
              borderColor: 'silver',
            }}     
          >
            <Grid container
              direction='column'
              gap={2}
              sx={{
                pl: 2,
              }}
            >
              {/* id */}
              <GridTypo>id: {rule.id}</GridTypo>
              {/* priority */}
              <Grid item>
                <GridRow>
                  <GridTypo xs={2}>priority</GridTypo>
                  <Grid item xs={2}>
                    <TextField
                      size='small'
                      type='number'
                      placeholder='priority'
                      value={rule.priority}
                      InputProps={{inputProps: {
                        min: 1,
                      }}}
                      onChange={(event) => 
                        dispatch({
                          id: rule.id, 
                          target: 'PRIORITY', 
                          priority: parseInt(event.target.value) < 1 ? 1 : parseInt(event.target.value)
                        })
                      }
                    />
                  </Grid>
                </GridRow>
              </Grid>
              {/* action */}
              <Grid item>
                <GridRow>
                  <GridTypo xs={2}>action</GridTypo>
                  {/* type */}
                  <GridTypo xs={2}>type</GridTypo>
                  <Grid item>
                    <FormControl size='small'>
                      <Select
                        value={rule.action.type}
                        onChange={(event) => 
                          dispatch({
                            id: rule.id, 
                            target: 'ACTIONTYPE', 
                            actionType: event.target.value as chrome.declarativeNetRequest.RuleActionType
                          })
                        }
                      >
                        <MenuItem value={chrome.declarativeNetRequest.RuleActionType.BLOCK}>
                          block
                        </MenuItem>
                        <MenuItem value={chrome.declarativeNetRequest.RuleActionType.REDIRECT}>
                          redirect
                        </MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                </GridRow>
              </Grid>
              {/* redirect */}
              {/* Display only when redirect is selected */}
              {(() => {
                if (rule.action.type == chrome.declarativeNetRequest.RuleActionType.REDIRECT as chrome.declarativeNetRequest.RuleActionType) {
                  return(
                    <>
                      <GridRow>
                        <Grid item xs={2} />
                        <GridTypo xs={2}>redirect</GridTypo>
                        <Grid item xs={2}>
                          <FormControl size='small' sx={{overflow: 'hidden', width: 100}}>
                            <Select
                              value={rule.redirectType}
                              onChange={(event) =>
                                dispatch({
                                  id: rule.id,
                                  target: 'REDIRECTTYPE',
                                  redirectType: event.target.value as RedirectType
                                })
                              }
                            >
                              <MenuItem value='URL'>
                                url
                              </MenuItem>
                              <MenuItem value='REGEXSUBSTITUTION'>
                                regexSubstitution
                              </MenuItem>
                              <MenuItem value='EXTENSIONPATH'>
                                extensionPath
                              </MenuItem>
                            </Select>
                          </FormControl>
                        </Grid>
                        <Hidden mdUp>
                          <Grid item xs={3}><p></p></Grid>
                          <Grid item xs={2}><p></p></Grid>
                        </Hidden>
                        <Grid item xs={9} md={5}>
                          {(() => {
                            switch (rule.redirectType) {
                              case 'URL':
                                return(
                                  <TextField
                                    fullWidth
                                    size='small'
                                    placeholder='url'
                                    value={rule.action.redirect?.url}
                                    onChange={(event) => 
                                      dispatch({
                                        id: rule.id,
                                        target: 'URL',
                                        url: event.target.value
                                      }) 
                                    }
                                  />
                                );
                              case 'REGEXSUBSTITUTION':
                                return(
                                  <TextField
                                    fullWidth
                                    size='small'
                                    placeholder='regex substitution'
                                    value={rule.action.redirect?.regexSubstitution}
                                    onChange={(event) => 
                                      dispatch({
                                        id: rule.id,
                                        target: 'REGEXSUBSTITUTION',
                                        regexSubstitution: event.target.value
                                      }) 
                                    }
                                  />
                                );
                              case 'EXTENSIONPATH':
                                return(
                                  <TextField
                                    fullWidth
                                    size='small'
                                    placeholder='extension path'
                                    value={rule.action.redirect?.extensionPath}
                                    onChange={(event) => 
                                      dispatch({
                                        id: rule.id,
                                        target: 'EXTENSIONPATH',
                                        extensionPath: event.target.value
                                      }) 
                                    }
                                  />
                                );
                            }
                          })()}
                        </Grid>
                      </GridRow>
                    </>
                  );
                }
              })()}
              {/* condition */}
              <GridRow>
                <GridTypo xs={2}>condition</GridTypo>
                <GridTypo xs={2}>domains</GridTypo>
                <Grid item>
                    <FormControl size='small'>
                      <Select
                        value={rule.condition.domainType}
                        onChange={(event) => 
                          dispatch({
                            id: rule.id, 
                            target: 'DOMAINTYPE', 
                            domainType: event.target.value as chrome.declarativeNetRequest.DomainType ?? undefined
                          })
                        }
                      >
                        <MenuItem value=''></MenuItem>
                        <MenuItem value={chrome.declarativeNetRequest.DomainType.FIRST_PARTY}>
                          fitstParty
                        </MenuItem>
                        <MenuItem value={chrome.declarativeNetRequest.DomainType.THIRD_PARTY}>
                          thirdParty
                        </MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
              </GridRow>
            </Grid>
          </Box>
        );
      })}
      <Box
        sx={{
          p: 2,
          display: 'flex',
          justyfyContent: 'flex-end',
        }}
      >
        <div style={{ flexGrow: 1 }}/>
        <Button
          variant='outlined'
          sx={{
            textTransform: 'none',
          }}
          onClick={() => {
            dispatch({target: 'ADDEMPTY'})
          }}
        >
          Add a Rule
        </Button>
      </Box>
    </Container>
  );
};

const GridTypo = ({children, xs}: {children: ReactNode; xs?: number | undefined}) => {
  if (xs) {
    return (
      <Grid item xs={xs}>
        <Typography
          variant='h6'
        >
          {children}
        </Typography>
      </Grid>
    );
  } else {
    return (
      <Grid item>
        <Typography
          variant='h6'
        >
          {children}
        </Typography>
      </Grid>
    );
  }
}

const GridRow = ({children}: {children: ReactNode}) => {
  return (
    <Grid container
      direction='row'
      alignItems='center'
      gap={2}
    >
      {children}
    </Grid>
  );
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Main />
  </React.StrictMode>
);