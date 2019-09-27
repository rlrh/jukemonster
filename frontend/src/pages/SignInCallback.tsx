import React, { Component } from 'react';
import { Redirect, RouteComponentProps } from 'react-router';
import {
  IonPage,
  IonHeader,
  IonContent,
  IonToolbar,
  IonTitle,
  IonProgressBar,
} from '@ionic/react';
import { useAuth } from '../state/useAuth';
import * as queryString from 'query-string';

const SignInCallback = props => {
  const { signIn } = useAuth();
  return <SignInCallbackChild {...props} onSignIn={signIn} />;
};

interface IProps {
  location: Location;
  onSignIn: (data: {}) => void;
}

interface IState {
  data: {} | null;
  isLoading: boolean;
  error: string | null;
  redirectTo: string;
}
class SignInCallbackChild extends Component<
  RouteComponentProps & IProps,
  IState
> {
  constructor(props) {
    super(props);
    this.state = {
      data: null,
      isLoading: false,
      error: null,
      redirectTo: '/',
    };
  }

  componentDidMount() {
    this.setState({ isLoading: true });
    fetch(
      process.env.REACT_APP_BACKEND_URL +
        `/authorize/done/${this.props.location.search}`,
    )
      .then(response => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error('Something went wrong ...');
        }
      })
      .then(data => {
        (this.props as any).onSignIn(data);
        this.setState({
          redirectTo: queryString.parse(this.props.location.search)[
            'state'
          ] as string,
          isLoading: false,
          data: data,
        });
      })
      .catch(error => this.setState({ error, isLoading: false }));
  }

  render() {
    const { data, error, redirectTo } = this.state;

    if (data) {
      return <Redirect to={redirectTo || '/'} />;
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
