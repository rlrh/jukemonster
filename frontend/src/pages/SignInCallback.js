import React, { Component } from 'react';
import { Redirect } from 'react-router';
import {
  IonPage,
  IonHeader,
  IonContent,
  IonToolbar,
  IonTitle,
  IonProgressBar,
} from '@ionic/react';
import { useAuth } from '../state/useAuth';

const SignInCallback = props => {
  const { signIn } = useAuth();
  return <SignInCallbackChild {...props} onSignIn={signIn} />;
};

class SignInCallbackChild extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: null,
      isLoading: false,
      error: null,
    };
  }

  componentDidMount() {
    this.setState({ isLoading: true });
    fetch(`http://127.0.0.1:8000/authorize/done/${this.props.location.search}`)
      .then(response => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error('Something went wrong ...');
        }
      })
      .then(data => {
        this.setState({ data, isLoading: false });
        console.log('Your token is: ' + data.access_token);
        this.props.onSignIn(data.access_token);
      })
      .catch(error => this.setState({ error, isLoading: false }));
  }

  render() {
    const { data, error } = this.state;

    if (data) {
      return <Redirect to="/" />;
    }

    if (error) {
      return (
        <IonPage>
          <IonHeader>
            <IonToolbar>
              <IonTitle>Login Failed</IonTitle>
            </IonToolbar>
          </IonHeader>
          <IonContent>
            <h2>Something went wrong...</h2>
          </IonContent>
        </IonPage>
      );
    }

    return (
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonTitle>Logging in...</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent>
          <IonProgressBar type="indeterminate"></IonProgressBar>
        </IonContent>
      </IonPage>
    );
  }
}

export default SignInCallback;
