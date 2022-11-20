import { 
  Container, 
  Box, 
  Grid, 
  Typography, 
  TextField, 
  Select, 
  MenuItem, 
  InputLabel,
  Button, 
} from '@mui/material';
import React, {useState, useEffect, useReducer} from 'react';
import ReactDOM from 'react-dom/client';
import './options.css';

type Action = 
  {
    target: "ALL";
    rules: chrome.declarativeNetRequest.Rule[];
  } |
  {
    target: "ADDEMPTY";
  } |
  {
    id: number;
    target: "PRIORITY";
    priority: number;
  } |
  {
    id: number;
    target: "ACTIONTYPE";
    actionType: chrome.declarativeNetRequest.RuleActionType;
  } |
  {
    id: number;
    target: "EXTENSIONPATH";
    extensionPath: string;
  } |
  {
    id: number;
    target: "REGEXSUBSTITUTION";
    regexSubstitution: string;
  } |
  {
    id: number;
    target: "URL";
    url: string;
  } |
  {
    id: number;
    target: "DOMAINTYPE";
    domainType: chrome.declarativeNetRequest.DomainType;
  } |
  {
    id: number;
    target: "INITIATORDOMAINS";
    initiatorDomains: string[];
  } |
  {
    id: number;
    target: "EXCLUDEDINITIATORDOMAINS";
    excludedInitiatorDomains: string[];
  } |
  {
    id: number;
    target: "REQUESTDOMAINS";
    requestDomains: string[];
  } |
  {
    id: number;
    target: "EXCLUDEDREQUESTDOMAINS";
    excludedRequestDomains: string[];
  } |
  {
    id: number;
    target: "REQUESTMETHODS";
    requestMethods: chrome.declarativeNetRequest.RequestMethod[];
  } |
  {
    id: number;
    target: "EXCLUDEDREQUESTMETHODS";
    excludedRequestMethods: chrome.declarativeNetRequest.RequestMethod[];
  } |
  {
    id: number;
    target: "RESOURCETYPES";
    resourceTypes: chrome.declarativeNetRequest.ResourceType[];
  } |
  {
    id: number;
    target: "EXCLUDEDRESOURCETYPES";
    excludedResourceTypes: chrome.declarativeNetRequest.ResourceType[];
  } |
  {
    id: number;
    target: "REGEXFILTER";
    regexFilter: string;
  } |
  {
    id: number;
    target: "URLFILTER";
    urlFilter: string;
  } 
;

const initialState: chrome.declarativeNetRequest.Rule[] = [];

const reducer = (state: chrome.declarativeNetRequest.Rule[], act: Action) => {
  switch (act.target) {
    case "ALL":
      return act.rules;
    case "ADDEMPTY":
      return [...state, {
        id: state.length == 0 ? 1 : state.slice(-1)[0].id + 1,
        priority: 1,
        action: {type: chrome.declarativeNetRequest.RuleActionType.REDIRECT},
        condition: {}
      }];
    case "PRIORITY":
      return state.map((rule) => (
        rule.id == act.id ? {...rule, priority: act.priority} : rule
      ));
    case "ACTIONTYPE":
      return state.map((rule) => (
        rule.id == act.id ? {...rule, action: {...(rule.action), type: act.actionType}} : rule
      ));
    case "EXTENSIONPATH":
      return state.map((rule) => (
        rule.id == act.id ? {...rule, action: {...(rule.action), redirect: {...(rule.action.redirect), extensionPath: act.extensionPath}}} : rule
      ));
    case "REGEXSUBSTITUTION":
      return state.map((rule) => (
        rule.id == act.id ? {...rule, action: {...(rule.action), redirect: {...(rule.action.redirect), regexSubstitution: act.regexSubstitution}}} : rule
      ));
    case "URL":
      return state.map((rule) => (
        rule.id == act.id ? {...rule, action: {...(rule.action), redirect: {...(rule.action.redirect), url: act.url}}} : rule
      ));
    case "DOMAINTYPE":
      return state.map((rule) => (
        rule.id == act.id ? {...rule, condition: {...(rule.condition), domainType: act.domainType}} : rule
      ));
    case "INITIATORDOMAINS":
      return state.map((rule) => (
        rule.id == act.id ? {...rule, condition: {...(rule.condition), initiatorDomains: act.initiatorDomains}} : rule
      ));
    case "EXCLUDEDINITIATORDOMAINS":
      return state.map((rule) => (
        rule.id == act.id ? {...rule, condition: {...(rule.condition), excludedInitiatorDomains: act.excludedInitiatorDomains}} : rule
      ));
    case "REQUESTDOMAINS":
      return state.map((rule) => (
        rule.id == act.id ? {...rule, condition: {...(rule.condition), requestDomains: act.requestDomains}} : rule
      ));
    case "EXCLUDEDREQUESTDOMAINS":
      return state.map((rule) => (
        rule.id == act.id ? {...rule, condition: {...(rule.condition), excludedRequestDomains: act.excludedRequestDomains}} : rule
      ));
    case "REQUESTMETHODS":
      return state.map((rule) => (
        rule.id == act.id ? {...rule, condition: {...(rule.condition), requestMethods: act.requestMethods}} : rule
      ));
    case "EXCLUDEDREQUESTMETHODS":
      return state.map((rule) => (
        rule.id == act.id ? {...rule, condition: {...(rule.condition), excludedRequestMethods: act.excludedRequestMethods}} : rule
      ));
    case "RESOURCETYPES":
      return state.map((rule) => (
        rule.id == act.id ? {...rule, condition: {...(rule.condition), resourceTypes: act.resourceTypes}} : rule
      ));
    case "EXCLUDEDRESOURCETYPES":
      return state.map((rule) => (
        rule.id == act.id ? {...rule, condition: {...(rule.condition), excludedResourceTypes: act.excludedResourceTypes}} : rule
      ));
    case "REGEXFILTER":
      return state.map((rule) => (
        rule.id == act.id ? {...rule, condition: {...(rule.condition), regexFilter: act.regexFilter}} : rule
      ));
    case "URLFILTER":
      return state.map((rule) => (
        rule.id == act.id ? {...rule, condition: {...(rule.condition), urlFilter: act.urlFilter}} : rule
      ));
    default:
      return state;
  }
};

const Main = () => {
  // action, condition, id, priority?
  // const [ruleState, setRuleState] = useState<chrome.declarativeNetRequest.Rule[]>([]);
  const [ruleState, dispatch] = useReducer(reducer, initialState);
  const [status, setStatus] = useState<string>("");

  useEffect(() => {
    chrome.declarativeNetRequest.getDynamicRules(rules => {
      // Set state
      dispatch({target: "ALL", rules: rules});
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
          setStatus("Rules updated.");
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
              borderColor: 'silver'
            }}
          >
            <Grid container
              direction="column"
              gap={2}
              sx={{
                pl: 2,
              }}
            >
              <Grid item>
                <Typography
                  component="h2"
                  variant="h5"
                >
                  id: {rule.id}
                </Typography>
              </Grid>
              <Grid item>
                <TextField
                  label="priority"
                  type="number"
                  value={rule.priority}
                  InputProps={{inputProps: {min: 1}}}
                  InputLabelProps={{shrink: true}}
                  onChange={(event) => 
                    dispatch({
                      id: rule.id, 
                      target: "PRIORITY", 
                      priority: Number(event.target.value) < 1 ? 1 : parseInt(event.target.value)
                    })
                  }
                />
              </Grid>
              <Grid item>
                <Grid container
                  direction="row"
                  alignItems="center"
                  gap={2}
                >
                  <Grid item>
                    <Typography
                      component="h2"
                      variant="h5"
                    >
                      action
                    </Typography>
                  </Grid>
                  <Grid item>
                    <InputLabel
                      id='type'
                    >
                      type
                    </InputLabel>
                    <Select
                      labelId='type'
                      value={rule.action.type}
                      onChange={(event) => 
                        dispatch({
                          id: rule.id, 
                          target: "ACTIONTYPE", 
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
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Box>
        );
      })}
      <Box
        sx={{
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
            dispatch({target: "ADDEMPTY"})
          }}
        >
          Add a Rule
        </Button>
      </Box>
    </Container>
  );
};

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Main />
  </React.StrictMode>
);