/*
 * <license header>
 */

import React, { useState } from 'react';
import {
  Flex,
  Heading,
  Form,
  Picker,
  TextArea,
  ActionButton,
  StatusLight,
  ProgressCircle,
  Item,
  Text,
  View,
} from '@adobe/react-spectrum';
import Function from '@spectrum-icons/workflow/Function';

import allActions from '../config.json';
import actionWebInvoke from '../utils';

// Adobe App Builder Runtime interface
interface AppBuilderRuntime {
  on: (event: string, handler: (data: any) => void) => void;
  // Add other runtime methods as needed
}

// Adobe IMS interface
interface AdobeIMS {
  token?: string;
  org?: string;
  // Add other IMS properties as needed
}

interface ActionsFormProps {
  runtime: AppBuilderRuntime;
  ims: AdobeIMS;
}

interface ActionState {
  actionSelected: string | null;
  actionResponse: any;
  actionResponseError: string | null;
  actionHeaders: Record<string, any> | null;
  actionHeadersValid: 'valid' | 'invalid' | undefined;
  actionParams: Record<string, any> | null;
  actionParamsValid: 'valid' | 'invalid' | undefined;
  actionInvokeInProgress: boolean;
  actionResult: string;
}

interface ActionItem {
  name: string;
}

// remove the deprecated key
const actions: Record<string, any> = Object.keys(allActions).reduce(
  (obj, key) => {
    if (key.lastIndexOf('/') > -1) {
      obj[key] = (allActions as Record<string, any>)[key];
    }
    return obj;
  },
  {} as Record<string, any>
);

const ActionsForm: React.FC<ActionsFormProps> = props => {
  const [state, setState] = useState<ActionState>({
    actionSelected: null,
    actionResponse: null,
    actionResponseError: null,
    actionHeaders: null,
    actionHeadersValid: undefined,
    actionParams: null,
    actionParamsValid: undefined,
    actionInvokeInProgress: false,
    actionResult: '',
  });

  // parses a JSON input and adds it to the state
  const setJSONInput = (
    input: string,
    stateJSON: keyof ActionState,
    stateValid: keyof ActionState
  ) => {
    let content: any;
    let validStr: 'valid' | 'invalid' | undefined = undefined;
    if (input) {
      try {
        content = JSON.parse(input);
        validStr = 'valid';
      } catch (e) {
        content = null;
        validStr = 'invalid';
      }
    }
    setState(prevState => ({
      ...prevState,
      [stateJSON]: content,
      [stateValid]: validStr,
    }));
  };

  // invokes a the selected backend actions with input headers and params
  const invokeAction = async () => {
    setState(prevState => ({
      ...prevState,
      actionInvokeInProgress: true,
      actionResult: 'calling action ... ',
    }));

    const actionName = state.actionSelected;
    if (!actionName) return;

    const headers: Record<string, any> = state.actionHeaders || {};
    const params: Record<string, any> = state.actionParams || {};
    const startTime = Date.now();

    // all headers to lowercase
    Object.keys(headers).forEach(h => {
      const lowercase = h.toLowerCase();
      if (lowercase !== h) {
        headers[lowercase] = headers[h];
        headers[h] = undefined;
        delete headers[h];
      }
    });

    // set the authorization header and org from the ims props object
    if (props.ims.token && !headers.authorization) {
      headers.authorization = `Bearer ${props.ims.token}`;
    }
    if (props.ims.org && !headers['x-gw-ims-org-id']) {
      headers['x-gw-ims-org-id'] = props.ims.org;
    }

    let formattedResult = '';
    try {
      // invoke backend action
      const actionResponse = await actionWebInvoke(actions[actionName], headers, params);
      formattedResult = `time: ${Date.now() - startTime} ms\n${JSON.stringify(actionResponse, null, 2)}`;
      // store the response
      setState(prevState => ({
        ...prevState,
        actionResponse,
        actionResult: formattedResult,
        actionResponseError: null,
        actionInvokeInProgress: false,
      }));
      console.log(`Response from ${actionName}:`, actionResponse);
    } catch (e) {
      // log and store any error message
      const errorMessage = e instanceof Error ? e.message : 'Unknown error';
      formattedResult = `time: ${Date.now() - startTime} ms\n${errorMessage}`;
      console.error(e);
      setState(prevState => ({
        ...prevState,
        actionResponse: null,
        actionResult: formattedResult,
        actionResponseError: errorMessage,
        actionInvokeInProgress: false,
      }));
    }
  };

  const actionItems: ActionItem[] = Object.keys(actions).map(k => ({ name: k }));

  return (
    <View width='size-6000'>
      <Heading level={1}>Run your application backend actions</Heading>
      {Object.keys(actions).length > 0 && (
        <Form necessityIndicator='label'>
          <Picker
            label='Actions'
            isRequired={true}
            placeholder='select an action'
            aria-label='select an action'
            items={actionItems}
            onSelectionChange={(name: React.Key | null) =>
              setState(prevState => ({
                ...prevState,
                actionSelected: name as string,
                actionResponseError: null,
                actionResponse: null,
              }))
            }
          >
            {(item: ActionItem) => <Item key={item.name}>{item.name}</Item>}
          </Picker>

          <TextArea
            label='headers'
            placeholder='{ "key": "value" }'
            validationState={state.actionHeadersValid}
            onChange={(input: string) => setJSONInput(input, 'actionHeaders', 'actionHeadersValid')}
          />

          <TextArea
            label='params'
            placeholder='{ "key": "value" }'
            validationState={state.actionParamsValid}
            onChange={(input: string) => setJSONInput(input, 'actionParams', 'actionParamsValid')}
          />

          <Flex>
            <ActionButton type='button' onPress={invokeAction} isDisabled={!state.actionSelected}>
              <Function aria-label='Invoke' />
              <Text>Invoke</Text>
            </ActionButton>

            <ProgressCircle
              aria-label='loading'
              isIndeterminate
              isHidden={!state.actionInvokeInProgress}
              marginStart='size-100'
            />
          </Flex>
        </Form>
      )}

      {state.actionResponseError && (
        <View
          padding={'size-100'}
          marginTop={'size-100'}
          marginBottom={'size-100'}
          borderRadius={'small'}
        >
          <StatusLight variant='negative'>
            Failure! See the complete error in your browser console.
          </StatusLight>
        </View>
      )}
      {!state.actionResponseError && state.actionResponse && (
        <View
          padding={'size-100'}
          marginTop={'size-100'}
          marginBottom={'size-100'}
          borderRadius={'small'}
        >
          <StatusLight variant='positive'>
            Success! See the complete response in your browser console.
          </StatusLight>
        </View>
      )}

      {Object.keys(actions).length === 0 && <Text>You have no actions !</Text>}
      <TextArea
        label='results'
        isReadOnly={true}
        width='size-6000'
        height='size-6000'
        maxWidth='100%'
        value={state.actionResult}
        validationState={!state.actionResponseError ? 'valid' : 'invalid'}
      />
    </View>
  );
};

export default ActionsForm;
