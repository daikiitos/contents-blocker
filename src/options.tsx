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
  Autocomplete,
  Alert,
  AlertTitle,
} from '@mui/material';
import React, { useState, useEffect, useReducer, ReactNode } from 'react';
import ReactDOM from 'react-dom/client';
import './options.css';

type RedirectType = 'URL' | 'REGEXSUBSTITUTION' | 'EXTENSIONPATH';
type FilterType = 'URLFILTER' | 'REGEXFILTER';

class MyRule implements chrome.declarativeNetRequest.Rule {
  action!: chrome.declarativeNetRequest.RuleAction;
  condition!: chrome.declarativeNetRequest.RuleCondition;
  id!: number;
  priority?: number | undefined;
  redirectType?: RedirectType | undefined;
  filterType?: FilterType | undefined;
}

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

const initialState: MyRule[] = [];

const reducer = (state: MyRule[], act: Action) => {
  switch (act.target) {
    case 'ALL':
      return act.rules.map((rule) => {
        if (rule.action.type == chrome.declarativeNetRequest.RuleActionType.REDIRECT) {
          if (rule.action.redirect?.url) {
            rule.redirectType = 'URL';
          } else if (rule.action.redirect?.regexSubstitution) {
            rule.redirectType = 'REGEXSUBSTITUTION';
          } else if (rule.action.redirect?.extensionPath) {
            rule.redirectType = 'EXTENSIONPATH';
          }
        }
        if (rule.condition.urlFilter) {
          rule.filterType = 'URLFILTER';
        } else if (rule.condition.regexFilter) {
          rule.filterType = 'REGEXFILTER';
        }
        return rule;
      });
    case 'ADDEMPTY':
      return [...state, {
        id: state.length == 0 ? 1 : state.slice(-1)[0].id + 1,
        priority: 1,
        action: { type: chrome.declarativeNetRequest.RuleActionType.BLOCK },
        condition: {}
      }];
    case 'REDIRECTTYPE':
      return state.map((rule) => 
        rule.id == act.id ? {
          ...rule, 
          redirectType: act.redirectType ?? undefined, 
          action: { ...rule.action, redirect: {} }
        } : rule
      );
    case 'PRIORITY':
      return state.map((rule) => 
        rule.id == act.id ? { ...rule, priority: act.priority ?? undefined } : rule
      );
    case 'ACTIONTYPE':
      return state.map((rule) => 
        rule.id == act.id ? {
          ...rule, 
          action: { ...rule.action, 
            type: act.actionType, 
            redirect: { ...rule.action.redirect, 
              url: act.actionType == chrome.declarativeNetRequest.RuleActionType.REDIRECT ? (rule.action.redirect?.url ?? '') : undefined
          }}, 
          redirectType: act.actionType == chrome.declarativeNetRequest.RuleActionType.REDIRECT ? (rule.redirectType ?? 'URL' as RedirectType) : undefined
        } : rule
      );
    case 'EXTENSIONPATH':
      return state.map((rule) => 
        rule.id == act.id ? {...rule, action: { ...rule.action, redirect: { ...rule.action.redirect, 
          extensionPath: act.extensionPath ?? undefined
        }}} : rule
      );
    case 'REGEXSUBSTITUTION':
      return state.map((rule) => 
        rule.id == act.id ? { ...rule, action: { ...rule.action, redirect: { ...rule.action.redirect, 
          regexSubstitution: act.regexSubstitution ?? undefined
        }}} : rule
      );
    case 'URL':
      return state.map((rule) => 
        rule.id == act.id ? { ...rule, action: { ...rule.action, redirect: { ...rule.action.redirect, 
          url: act.url ?? undefined
        }}} : rule
      );
    case 'DOMAINTYPE':
      return state.map((rule) => 
        rule.id == act.id 
        ? {...rule, condition: { ...rule.condition, 
          domainType: act.domainType ?? undefined
        }} : rule
      );
    case 'INITIATORDOMAINS':
      return state.map((rule) => 
        rule.id == act.id ? { ...rule, condition: { ...rule.condition, 
          initiatorDomains: act.initiatorDomains?.length ? act.initiatorDomains : undefined
        }} : rule
      );
    case 'EXCLUDEDINITIATORDOMAINS':
      return state.map((rule) => 
        rule.id == act.id ? {...rule, condition: { ...rule.condition, 
          excludedInitiatorDomains: act.excludedInitiatorDomains?.length ? act.excludedInitiatorDomains : undefined
        }} : rule
      );
    case 'REQUESTDOMAINS':
      return state.map((rule) => 
        rule.id == act.id ? { ...rule, condition: { ...rule.condition, 
          requestDomains: act.requestDomains?.length ? act.requestDomains : undefined
        }} : rule
      );
    case 'EXCLUDEDREQUESTDOMAINS':
      return state.map((rule) => 
        rule.id == act.id ? { ...rule, condition: { ...rule.condition, 
          excludedRequestDomains: act.excludedRequestDomains?.length ? act.excludedRequestDomains : undefined
        }} : rule
      );
    case 'REQUESTMETHODS':
      return state.map((rule) => 
        rule.id == act.id ? { ...rule, condition: { ...rule.condition, 
          requestMethods: act.requestMethods?.length ? act.requestMethods : undefined
        }} : rule
      );
    case 'EXCLUDEDREQUESTMETHODS':
      return state.map((rule) => 
        rule.id == act.id ? { ...rule, condition: { ...rule.condition, 
          excludedRequestMethods: act.excludedRequestMethods?.length ? act.excludedRequestMethods : undefined
        }} : rule
      );
    case 'RESOURCETYPES':
      return state.map((rule) => 
        rule.id == act.id ? { ...rule, condition: { ...rule.condition, 
          resourceTypes: act.resourceTypes?.length ? act.resourceTypes : undefined
        }} : rule
      );
    case 'EXCLUDEDRESOURCETYPES':
      return state.map((rule) => 
        rule.id == act.id ? { ...rule, condition: { ...rule.condition, 
          excludedResourceTypes: act.excludedResourceTypes?.length ? act.excludedResourceTypes : undefined
        }} : rule
      );
    case 'REGEXFILTER':
      return state.map((rule) => 
        rule.id == act.id ? { ...rule, condition: { ...rule.condition, 
          regexFilter: act.regexFilter ?? undefined, 
          urlFilter: undefined
        }} : rule
      );
    case 'URLFILTER':
      return state.map((rule) => 
        rule.id == act.id ? { ...rule, condition: { ...rule.condition, 
          urlFilter: act.urlFilter ?? undefined, 
          regexFilter: undefined
        }} : rule
      );
    case 'FILTERTYPE':
      return state.map((rule) =>
        rule.id == act.id ? { ...rule, 
          filterType: act.filterType ?? undefined,
          condition: { ...rule.condition, 
            urlFilter: undefined,
            regexFilter: undefined
          }
        } : rule
      );
    default:
      return state;
  }
};

type Status = {
  status: 'SUCCESSED' | 'ERROR' | undefined;
  message: string | undefined;
}

const Main = () => {
  // action, condition, id, priority?
  // const [ruleState, setRuleState] = useState<MyRule[]>([]);
  const [ruleState, dispatch] = useReducer(reducer, initialState);
  const [status, setStatus] = useState<Status[]>([]);

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
        addRules: ruleState.map(rule => {
          const { redirectType, filterType, ...rest } = rule;
          return rest;
        })
      },
      () => {
        if (chrome.runtime.lastError) {
          setStatus([{ status: 'ERROR', message: chrome.runtime.lastError.message! }, ...status]);
        } else {
          setStatus([{ status: 'SUCCESSED', message: 'Rules updated.' }, ...status]);
          console.table(ruleState);
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
              <Grid item>
                <GridRow>
                  <FirstColumn>
                    <MyTypo>id</MyTypo>
                  </FirstColumn>
                  <SecondColumn>
                    <MyTypo>{rule.id}</MyTypo>
                  </SecondColumn>
                </GridRow>
              </Grid>
              {/* priority */}
              <Grid item>
                <GridRow>
                  <FirstColumn>
                    <MyTypo>priority</MyTypo>
                  </FirstColumn>
                  <SecondColumn>
                    <TextField
                      size='small'
                      type='number'
                      style={{width: 80}}
                      placeholder='priority'
                      value={rule.priority}
                      InputProps={{inputProps: {
                        min: 1,
                        style: {textAlign: 'right'}
                      }}}
                      onChange={(event) => 
                        dispatch({
                          id: rule.id, 
                          target: 'PRIORITY', 
                          priority: parseInt(event.target.value) > 1 ? parseInt(event.target.value) : 1
                        })
                      }
                    />
                  </SecondColumn>
                </GridRow>
              </Grid>
              {/* action */}
              <Grid item>
                <GridRow>
                  <FirstColumn><MyTypo>action</MyTypo></FirstColumn>
                  {/* type */}
                  <SecondColumn><MyTypo>type</MyTypo></SecondColumn>
                  <ThirdColumn>
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
                  </ThirdColumn>
                </GridRow>
              </Grid>
              {/* redirect */}
              {/* Display only when redirect is selected */}
              {(() => {
                if (rule.action.type == chrome.declarativeNetRequest.RuleActionType.REDIRECT as chrome.declarativeNetRequest.RuleActionType) {
                  return(
                    <>
                      <GridRow>
                        <FirstColumn />
                        <SecondColumn><MyTypo>redirect</MyTypo></SecondColumn>
                        <ThirdColumn>
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
                        </ThirdColumn>
                        <Hidden mdUp>
                          <GridItem xs={1}></GridItem>
                          <FirstColumn></FirstColumn>
                        </Hidden>
                        <GridItem xs={9} md={6}>
                          {(() => {
                            switch (rule.redirectType) {
                              case 'URL':
                                return(
                                  <TextField
                                    fullWidth
                                    size='small'
                                    placeholder='url'
                                    value={rule.action.redirect?.url ?? ''}
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
                                    value={rule.action.redirect?.regexSubstitution ?? ''}
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
                                    value={rule.action.redirect?.extensionPath ?? ''}
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
                        </GridItem>
                      </GridRow>
                    </>
                  );
                }
              })()}
              {/* condition */}
              <GridRow>
                <FirstColumn><MyTypo>condition</MyTypo></FirstColumn>
                {/* domainType */}
                <SecondColumn><MyTypo>domainType</MyTypo></SecondColumn>
                <ThirdColumn>
                  <FormControl size='small' sx={{overflow: 'hidden', width: 100}}>
                    <Select
                      value={rule.condition.domainType ?? ''}
                      onChange={(event) => 
                        dispatch({
                          id: rule.id, 
                          target: 'DOMAINTYPE', 
                          domainType: event.target.value as chrome.declarativeNetRequest.DomainType ?? undefined
                        })
                      }
                    >
                      <MenuItem value=''>None</MenuItem>
                      <MenuItem value={chrome.declarativeNetRequest.DomainType.FIRST_PARTY}>
                        firstParty
                      </MenuItem>
                      <MenuItem value={chrome.declarativeNetRequest.DomainType.THIRD_PARTY}>
                        thirdParty
                      </MenuItem>
                    </Select>
                  </FormControl>
                </ThirdColumn>
              </GridRow>
              {/* initiatorDomains */}
              {/* An empty list is not allowed */}
              <GridRow>
                <FirstColumn />
                <SecondColumn>
                  <MyTypo>initiatorDomains</MyTypo>
                </SecondColumn>
                <GridItem xs={5} md={8}>
                  <TextField
                      fullWidth
                      multiline
                      maxRows={2}
                      size='small'
                      placeholder='Enter comma delimited domains'
                      value={rule.condition.initiatorDomains?.join(',')}
                      onChange={(event) => 
                        dispatch({
                          id: rule.id,
                          target: 'INITIATORDOMAINS',
                          initiatorDomains: event.target.value ? event.target.value.split(',') : undefined
                        }) 
                      }
                    />
                </GridItem>
              </GridRow>
              {/* excludedInitiatorDomains */}
              <GridRow>
                <FirstColumn />
                <SecondColumn>
                  <MyTypo>excluded-initiatorDomains</MyTypo>
                </SecondColumn>
                <GridItem xs={5} md={8}>
                  <TextField
                      fullWidth
                      multiline
                      maxRows={2}
                      size='small'
                      placeholder='Enter comma delimited domains'
                      value={rule.condition.excludedInitiatorDomains?.join(',')}
                      onChange={(event) => 
                        dispatch({
                          id: rule.id,
                          target: 'EXCLUDEDINITIATORDOMAINS',
                          excludedInitiatorDomains: event.target.value ? event.target.value.split(',') : undefined
                        }) 
                      }
                    />
                </GridItem>
              </GridRow>
              {/* requestDomains */}
              {/* An empty list is not allowed */}
              <GridRow>
                <FirstColumn />
                <SecondColumn>
                  <MyTypo>requestDomains</MyTypo>
                </SecondColumn>
                <GridItem xs={5} md={8}>
                  <TextField
                      fullWidth
                      multiline
                      maxRows={2}
                      size='small'
                      placeholder='Enter comma delimited domains'
                      value={rule.condition.requestDomains?.join(',')}
                      onChange={(event) => 
                        dispatch({
                          id: rule.id,
                          target: 'REQUESTDOMAINS',
                          requestDomains: event.target.value ? event.target.value.split(',') : undefined
                        }) 
                      }
                    />
                </GridItem>
              </GridRow>
              {/* excludedRequestDomains */}
              <GridRow>
                <FirstColumn />
                <SecondColumn>
                  <MyTypo>excluded-requestDomains</MyTypo>
                </SecondColumn>
                <GridItem xs={5} md={8}>
                  <TextField
                      fullWidth
                      multiline
                      maxRows={2}
                      size='small'
                      placeholder='Enter comma delimited domains'
                      value={rule.condition.excludedRequestDomains?.join(',')}
                      onChange={(event) => 
                        dispatch({
                          id: rule.id,
                          target: 'EXCLUDEDREQUESTDOMAINS',
                          excludedRequestDomains: event.target.value ? event.target.value.split(',') : undefined
                        }) 
                      }
                    />
                </GridItem>
              </GridRow>
              {/* requestMethods */}
              {/* An empty list is not allowed */}
              <GridRow>
                <FirstColumn />
                <SecondColumn>
                  <MyTypo>requestMethods</MyTypo>
                </SecondColumn>
                <GridItem xs={5} md={8}>
                  <Autocomplete
                    multiple
                    fullWidth
                    size='small'
                    value={rule.condition.requestMethods ?? []}
                    onChange={(_, value) =>
                      dispatch({
                        id: rule.id,
                        target: 'REQUESTMETHODS',
                        requestMethods: value ?? undefined
                      })
                    }
                    options={Object.values(chrome.declarativeNetRequest.RequestMethod)}
                    getOptionLabel={(option) => option}
                    renderInput={(params) => (
                      <TextField {...params} />
                    )} 
                  />
                </GridItem>
              </GridRow>
              {/* resourceTypes */}
              {/* An empty list is not allowed */}
              <GridRow>
                <FirstColumn />
                <SecondColumn>
                  <MyTypo>resourceTypes</MyTypo>
                </SecondColumn>
                <GridItem xs={5} md={8}>
                  <Autocomplete
                    multiple
                    fullWidth
                    size='small'
                    value={rule.condition.resourceTypes ?? undefined}
                    onChange={(_, value) =>
                      dispatch({
                        id: rule.id,
                        target: 'RESOURCETYPES',
                        resourceTypes: value ?? undefined
                      })
                    }
                    options={Object.values(chrome.declarativeNetRequest.ResourceType)}
                    getOptionLabel={(option) => option}
                    renderInput={(params) => (
                      <TextField {...params} />
                    )} 
                  />
                </GridItem>
              </GridRow>
              {/* excludedResourceTypes */}
              <GridRow>
                <FirstColumn />
                <SecondColumn>
                  <MyTypo>excludedResourceTypes</MyTypo>
                </SecondColumn>
                <GridItem xs={5} md={8}>
                  <Autocomplete
                    multiple
                    fullWidth
                    size='small'
                    value={rule.condition.excludedResourceTypes ?? []}
                    onChange={(_, value) =>
                      dispatch({
                        id: rule.id,
                        target: 'EXCLUDEDRESOURCETYPES',
                        excludedResourceTypes: value ?? undefined
                      })
                    }
                    options={Object.values(chrome.declarativeNetRequest.ResourceType)}
                    getOptionLabel={(option) => option}
                    renderInput={(params) => (
                      <TextField {...params} />
                    )} 
                  />
                </GridItem>
              </GridRow>
              {/* urlFilter */}
              {/* An empty string is not allowed */}
              {/* A pattern beginning with ||* is not allowed. Use * instead. */}
              {/* regexFilter */}
              <GridRow>
                <FirstColumn />
                <SecondColumn>
                  <FormControl size='small' sx={{overflow: 'hidden', width: 150}}>
                    <Select
                      value={rule.filterType}
                      onChange={(event) =>
                        dispatch({
                          id: rule.id,
                          target: 'FILTERTYPE',
                          filterType: event.target.value as FilterType
                        })
                      }
                    >
                      <MenuItem value='URLFILTER'>
                        urlFilter
                      </MenuItem>
                      <MenuItem value='REGEXFILTER'>
                        regexFilter
                      </MenuItem>
                    </Select>
                  </FormControl>
                </SecondColumn>
                <GridItem xs={5} md={8}>
                  {(() => {
                    switch (rule.filterType) {
                      case 'URLFILTER':
                        return(
                          <TextField
                            fullWidth
                            size='small'
                            value={rule.condition.urlFilter ?? ''}
                            onChange={(event) => 
                              dispatch({
                                id: rule.id,
                                target: 'URLFILTER',
                                urlFilter: event.target.value
                              }) 
                            }
                          />);
                        case 'REGEXFILTER':
                          return(
                            <TextField
                              fullWidth
                              size='small'
                              value={rule.condition.regexFilter ?? ''}
                              onChange={(event) => 
                                dispatch({
                                  id: rule.id,
                                  target: 'REGEXFILTER',
                                  regexFilter: event.target.value
                                }) 
                              }
                            />
                          );
                    }
                  })()}
                </GridItem>
              </GridRow>
            </Grid>
          </Box>
        );
      })}
      <Grid container
        direction='column'
        alignItems='center'
        gap={1}
      >
        {status.map((st, index) => {
          return (
            <Grid item
              key={index}
            >
              <Alert 
                severity={st.status == 'SUCCESSED' ? 'success' : 'error'}
                onClose={() => {
                  setStatus(status.filter((_, i) => i != index))
                }}
              >
                <AlertTitle>{st.status}</AlertTitle>
                  {st.message}
              </Alert>
            </Grid>
          );
        })}
      </Grid>
      <Grid container
        direction='row'
        alignItems='center'
        justifyContent='flex-end'
        gap={2}
      >
        <Grid item>
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
        </Grid>
        <Grid item>
          <Button
            variant='outlined'
            sx={{
              textTransform: 'none',
            }}
            onClick={() => {
              upDateRules()
            }}
          >
            Save Rules
          </Button>
        </Grid>
      </Grid>
    </Container>
  );
};

const MyTypo = ({children}: {children?: ReactNode | undefined}) => {
  return (
    <Typography
      variant='h6'
      sx={{overflow: 'hidden', textOverflow: 'ellipsis'}}
    >
      {children}
    </Typography>
  );
}

const FirstColumn = ({children}: {children?: ReactNode | undefined}) => {
  return (
    <Grid item xs={2} md={1}>
      <Box display='flex' justifyContent='flex-start'>
        {children}
      </Box>
    </Grid>
  );
};

const SecondColumn = ({children}: {children?: ReactNode | undefined}) => {
  return (
    <Grid item xs={4} md={2}>
      <Box display='flex' justifyContent='flex-start'>
        {children}
      </Box>
    </Grid>
  );
};

const ThirdColumn = ({children}: {children?: ReactNode | undefined}) => {
  return (
    <Grid item xs={3} md={2}>
      <Box display='flex' justifyContent='flex-start'>
        {children}
      </Box>
    </Grid>
  );
};

const GridItem = ({children, xs, sm, md, lg, xl}: {
  children?: ReactNode | undefined, 
  xs?: number | undefined,
  sm?: number | undefined,
  md?: number | undefined,
  lg?: number | undefined,
  xl?: number | undefined
}) => {
  return (
    <Grid item xs={xs ?? false} sm={sm ?? false} md={md ?? false} lg={lg ?? false} xl={xl ?? false}>
      <Box display='flex' justifyContent='flex-start'>
        {children}
      </Box>
    </Grid>
  );
};

const GridRow = ({children}: {children?: ReactNode | undefined}) => {
  return (
    <Grid container
      direction='row'
      alignItems='center'
      gap={2}
    >
      {children}
    </Grid>
  );
};

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Main />
  </React.StrictMode>
);