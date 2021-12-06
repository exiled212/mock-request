/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import React, {useEffect} from 'react';
import {Table} from '../../components/body/Table';
import {RequestService} from '../services/RequestService';
import {GroupButton} from '../../components/buttons/GroupButton';
import {Button} from '../../components/buttons/Button';
import {InputGroup} from '../../components/input/InputGroup';
import {InputText} from '../../components/input/InputText';

const requestService = new RequestService();

export const PendingsTable = () => {
  const [headers] = React.useState([
    'id',
    'method',
    'url',
    'request',
    'actions',
  ]);
  const [rows, setRows] = React.useState([]);

  useEffect(getPendings, []);

  return (
    <React.Fragment>
      <Table rows={rows} headers={headers} />
    </React.Fragment>
  );

  /**
   *
   * @param {*} pending
   * @return {*}
   */
  function addButtons(pending) {
    const {domainUrl, setDomainUrl} = React.useState();
    return {
      ...pending,
      request:
        <InputGroup>
          <Button
            actionBtn={async ()=>{
              console.log(domainUrl);
            }}
          >Send</Button>
          <InputText
            placeholder={'domain url'}
            onChange={(evt)=>{
              setDomainUrl(evt.target.value);
            }}
          />
        </InputGroup>,
      actions:
      <GroupButton>
        <Button typeStyle="success">Set</Button>
        <Button
          typeStyle="danger"
          actionBtn={async ()=>{
            deletePending(pending);
          }}
        >
              X
        </Button>
      </GroupButton>,
    };
  }

  /**
   * Action Button Delete
   * @param {element} pending
   */
  async function deletePending(pending) {
    const isDeleted = await requestService.deleteRequest(pending);
    if (isDeleted) {
      await getPendings();
    }
  }

  /**
   * Get data from repository
   */
  async function getPendings() {
    const pendings = await requestService.getPendings();
    setRows(pendings.map(addButtons));
  }
};


