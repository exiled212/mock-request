/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import React, {useEffect} from 'react';
import {Table} from '../../components/body/Table';
import {RequestService} from '../services/RequestService';
import {GroupButton} from '../../components/buttons/GroupButton';
import {Button} from '../../components/buttons/Button';
import {InputGroup} from '../../components/input/InputGroup';
import {InputText} from '../../components/input/InputText';
import {Modal} from '../../components/body/Modal';
import {Card} from '../../components/body/Card';

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
  const [domainUrl, setDomainUrl] = React.useState();
  const [openModal, setOpenModal] = React.useState(false);
  const [currentDataModal, setCurrentDataModal] = React.useState();
  const [
    currentResponseData,
    setCurrentResponseData,
  ] = React.useState({});
  const closedButtonRef = React.useRef(null);


  useEffect(getPendings, []);

  return (
    <React.Fragment>
      <Table rows={rows} headers={headers} />
      <Modal
        openModal={openModal}
        setOpenModal={setOpenModal}
        closedButtonRef={closedButtonRef}
      >
        <Card
          title={'Send Response'}
          footer={
            <GroupButton>
              <Button
                typeStyle="success"
                actionBtn={async ()=>{
                  createResponse(currentDataModal, currentResponseData);
                  setCurrentDataModal(null);
                  setOpenModal(false);
                }}
              >Save</Button>
              <Button
                typeStyle="danger"
                actionBtn={async ()=>{
                  setOpenModal(false);
                  setCurrentDataModal(null);
                }}
              >Cancel</Button>
            </GroupButton>
          }
          footerProps={['text-right']}
        >
          <div className={'grid grid-cols-3 gap-4'}>
            <div className="col-span-1">
              <InputGroup>
                <Button typeStyle={'info'} >Method</Button>
                <InputText
                  value={
                    (currentDataModal)?currentDataModal.method:null
                  }
                  readOnly={true}
                />
              </InputGroup>
            </div>
            <div className="col-span-2">
              <InputGroup>
                <Button typeStyle={'info'} >Url</Button>
                <InputText
                  value={
                    (currentDataModal)?currentDataModal.url:null
                  }
                  readOnly={true}
                />
              </InputGroup>
            </div>
            <div className="col-span-3 text-center">
              <Card
                title={'Request Headers'}
              >{(currentDataModal && currentDataModal.headers)?
                <div className={'grid grid-cols-3 gap-4'}>
                  <div className="col-span-3">
                    {JSON.stringify(currentDataModal.headers)}
                  </div>
                </div>:
              null}</Card>
            </div>
            <div className="col-span-3 text-center">
              <Card
                title={'Request queryParams'}
              >{(currentDataModal && currentDataModal.queryParams)?
                <div className={'grid grid-cols-3 gap-4'}>
                  <div className="col-span-3">
                    {JSON.stringify(currentDataModal.queryParams)}
                  </div>
                </div>:
              null}</Card>
            </div>
            <div className="col-span-3 text-center">
              <Card
                title={'Request Body'}
              >{(currentDataModal && currentDataModal.body)?
                <div className={'grid grid-cols-3 gap-4'}>
                  <div className="col-span-3">
                    {JSON.stringify(currentDataModal.body)}
                  </div>
                </div>:
              null}</Card>
            </div>
            <div className="col-span-1 text-center">
              <InputGroup>
                <Button typeStyle={'info'} >Status</Button>
                <InputText
                  type={'number'}
                  onChange={(event)=>{
                    currentResponseData.status = event.target.value;
                    setCurrentResponseData(currentResponseData);
                  }}
                />
              </InputGroup>
            </div>
            <div className="col-span-3 text-center">
              <Card
                title={'Response Headers'}
              >
                <div className={'grid grid-cols-3 gap-4'}>
                  <div className="col-span-3">
                    <textarea
                      className='w-full'
                      onChange={(event)=>{
                        currentResponseData.headers = event.target.value;
                        setCurrentResponseData(currentResponseData);
                      }}
                    ></textarea>
                  </div>
                </div>
              </Card>
            </div>
            <div className="col-span-3 text-center">
              <Card
                title={'Response Body'}
              >
                <div className={'grid grid-cols-3 gap-4'}>
                  <div className="col-span-3">
                    <textarea
                      className='w-full'
                      onChange={(event)=>{
                        currentResponseData.content = event.target.value;
                        setCurrentResponseData(currentResponseData);
                      }}
                    ></textarea>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </Card>
      </Modal>
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
        <Button
          typeStyle="success"
          actionBtn={async ()=>{
            setCurrentDataModal(pending);
            setOpenModal(true);
          }}
        >Insert Response</Button>
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
   *
   * @param {*} pending
   * @param {*} response
   */
  async function createResponse(pending, response) {
    response.content = JSON.parse(response.content);
    response.headers = JSON.parse(response.headers);
    const isCreated = await requestService.createResponse(pending, response);
    if (isCreated) {
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


