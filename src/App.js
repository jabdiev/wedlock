import React, { useEffect, useState} from 'react';
import { Amplify} from 'aws-amplify';
import { generateClient } from 'aws-amplify/api';
import {listLists} from './graphql/queries';
import { Authenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import 'semantic-ui-css/semantic.min.css';

import awsExports from './aws-exports';
import MainHeader from './components/headers/MainHeader';
import Lists from './components/list/Lists';
import { Button, Container, Icon, Modal } from 'semantic-ui-react';
Amplify.configure(awsExports);
const client = generateClient();

export default function App() {

  const [lists, setLists] = useState([]);
  const [isModelOpen, setIsModelOpen] = useState(false);
  function toggleModel(shouldOpen) {
    setIsModelOpen(shouldOpen);
  }

  async function fetchList() {
    try {
      const {data} = await client.graphql({
        query: listLists
      });
      setLists(data.listLists.items);
      console.log('list', data);

    } catch (err) { console.log('error fetching list'); }
  }

  useEffect(() => {
    fetchList();
  }
  , []);

  return (
    <Authenticator>
      <Button className='floatingButton' onClick={() => toggleModel(true)}>
        <Icon name='plus' />
      </Button>
      <Container style={{height: '100vh'}}>
      <div className="App">
      {/* {({ signOut, user }) => (
        <main>
          <MainHeader />
          <Lists  lists={lists}/>
          <button onClick={signOut}>Sign out</button>
        </main>
      )} */}
      <MainHeader />
      <Lists  lists={lists}/>

      </div>
       </Container>
       <Modal open={isModelOpen} dimmer='blurring'>
        <Modal.Header>Create your list</Modal.Header>
        <Modal.Content>
        Form to be added later
        </Modal.Content>
        <Modal.Actions>
          <Button negative onClick={() => toggleModel(false)}>Cancel</Button>
          <Button positive onClick={() => toggleModel(false)}>
            Save
          </Button>
        </Modal.Actions>
      </Modal>
    </Authenticator>
  );
}
