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
      return state.map((rule) => 
        rule.id == act.id ? {
          ...rule, 
          redirectType: act.redirectType, 
          action: {...(rule.action), redirect: {}}
        } : rule
      );
    case 'PRIORITY':
      return state.map((rule) => 
        rule.id == act.id ? {...rule, priority: act.priority} : rule
      );
    case 'ACTIONTYPE':
      return state.map((rule) => 
        rule.id == act.id ? {
          ...rule, 
          action: {...(rule.action), 
            type: act.actionType, 
            redirect: {...(rule.action.redirect), 
              url: act.actionType == chrome.declarativeNetRequest.RuleActionType.REDIRECT ? (rule.action.redirect?.url ?? '') : undefined
          }}, 
          redirectType: act.actionType == chrome.declarativeNetRequest.RuleActionType.REDIRECT ? (rule.redirectType ?? 'URL' as RedirectType) : undefined
        } : rule
      );
    case 'EXTENSIONPATH':
      return state.map((rule) => 
        rule.id == act.id ? {...rule, action: {...(rule.action), redirect: {...(rule.action.redirect), 
          extensionPath: act.extensionPath
        }}} : rule
      );
    case 'REGEXSUBSTITUTION':
      return state.map((rule) => 
        rule.id == act.id ? {...rule, action: {...(rule.action), redirect: {...(rule.action.redirect), 
          regexSubstitution: act.regexSubstitution
        }}} : rule
      );
    case 'URL':
      return state.map((rule) => 
        rule.id == act.id ? {...rule, action: {...(rule.action), redirect: {...(rule.action.redirect), 
          url: act.url
        }}} : rule
      );
    case 'DOMAINTYPE':
      return state.map((rule) => 
        rule.id == act.id 
        ? {...rule, condition: {...(rule.condition), domainType: act.domainType}} : rule
      );
    case 'INITIATORDOMAINS':
      return state.map((rule) => 
        rule.id == act.id ? {...rule, condition: {...(rule.condition), initiatorDomains: act.initiatorDomains}} : rule
      );
    case 'EXCLUDEDINITIATORDOMAINS':
      return state.map((rule) => 
        rule.id == act.id ? {...rule, condition: {...(rule.condition), excludedInitiatorDomains: act.excludedInitiatorDomains}} : rule
      );
    case 'REQUESTDOMAINS':
      return state.map((rule) => 
        rule.id == act.id ? {...rule, condition: {...(rule.condition), requestDomains: act.requestDomains}} : rule
      );
    case 'EXCLUDEDREQUESTDOMAINS':
      return state.map((rule) => 
        rule.id == act.id ? {...rule, condition: {...(rule.condition), excludedRequestDomains: act.excludedRequestDomains}} : rule
      );
    case 'REQUESTMETHODS':
      return state.map((rule) => 
        rule.id == act.id ? {...rule, condition: {...(rule.condition), requestMethods: act.requestMethods}} : rule
      );
    case 'EXCLUDEDREQUESTMETHODS':
      return state.map((rule) => 
        rule.id == act.id ? {...rule, condition: {...(rule.condition), excludedRequestMethods: act.excludedRequestMethods}} : rule
      );
    case 'RESOURCETYPES':
      return state.map((rule) => 
        rule.id == act.id ? {...rule, condition: {...(rule.condition), resourceTypes: act.resourceTypes}} : rule
      );
    case 'EXCLUDEDRESOURCETYPES':
      return state.map((rule) => 
        rule.id == act.id ? {...rule, condition: {...(rule.condition), excludedResourceTypes: act.excludedResourceTypes}} : rule
      );
    case 'REGEXFILTER':
      return state.map((rule) => 
        rule.id == act.id ? {...rule, condition: {...(rule.condition), regexFilter: act.regexFilter}} : rule
      );
    case 'URLFILTER':
      return state.map((rule) => 
        rule.id == act.id ? {...rule, condition: {...(rule.condition), urlFilter: act.urlFilter}} : rule
      );
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
                <GridItem xs={5} md={7}>
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

              {/* urlFilter */}
              {/* An empty string is not allowed */}
              {/* A pattern beginning with ||* is not allowed. Use * instead. */}
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