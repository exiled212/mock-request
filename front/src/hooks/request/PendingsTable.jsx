import React, {useEffect} from 'react';
import {Table} from '../../components/body/Table';
import {RequestService} from '../services/RequestService';
import {GroupButton} from '../../components/buttons/GroupButton';
import {Button} from '../../components/buttons/Button';

const requestService = new RequestService();

export const PendingsTable = () => {
  const [headers] = React.useState(['id', 'method', 'url', 'actions']);
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
    return {
      ...pending,
      actions:
      <GroupButton>
        <Button>Request</Button>
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


