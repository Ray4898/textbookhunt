import React from 'react';
import { Grid, Loader, Header, Segment } from 'semantic-ui-react';
import swal from 'sweetalert';
import {
  AutoForm,
  ErrorsField,
  LongTextField,
  SubmitField,
  TextField,
} from 'uniforms-semantic';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import 'uniforms-bridge-simple-schema-2';
import { UserInfo, UserInfoSchema } from '../../api/userinfo/UserInfo';


/** Renders the Page for editing a single document. */
class EditProfile extends React.Component {
  /** On successful submit, insert the data. */
  submit(data) {
    const { user, firstName, lastName, image, major, description, _id } = data;
    UserInfo.update(_id, { $set: { user, firstName, lastName, image, major, description } }, (error) => (error ?
      swal('Error', error.message, 'error') :
      swal('Success', 'Item updated successfully', 'success')));
  }

  /** If the subscription(s) have been received, render the page, otherwise show a loading icon. */
  render() {
    return (this.props.ready) ? this.renderPage() : <Loader active>Getting data</Loader>;
  }

  /** Render the form. Use Uniforms: https://github.com/vazco/uniforms */
  renderPage() {
    return (
        <Grid container centered>
          <Grid.Column>
            <Header as="h2" textAlign="center">Edit Profile</Header>
            <AutoForm schema={UserInfoSchema} onSubmit={data => {
              // eslint-disable-next-line
              if (window.confirm('Are you sure you wish to save your changes?')) this.submit(data);
            } } model={this.props.doc}>
              <Segment>
                <TextField name='user'/>
                <TextField name = 'firstName'/>
                <TextField name = 'lastName'/>
                <TextField name='image'/>
                <TextField name = 'major'/>
                <LongTextField name = 'description'/>
                <SubmitField value='Submit'/>
                <ErrorsField/>
              </Segment>
            </AutoForm>
          </Grid.Column>
        </Grid>
    );
  }
}

/** Require the presence of a Profile document in the props object. Uniforms adds 'model' to the props, which we use. */
EditProfile.propTypes = {
  doc: PropTypes.object,
  model: PropTypes.object,
  ready: PropTypes.bool.isRequired,
};

/** withTracker connects Meteor data to React components. https://guide.meteor.com/react.html#using-withTracker */
export default withTracker(({ match }) => {
  // Get the documentID from the URL field. See imports/ui/layouts/App.jsx for the route containing :_id.
  const userAccount = Meteor.users.findOne(match.params._id);
  const userName = userAccount ? userAccount.username : '';
  const subscription = Meteor.subscribe('UserInfo');
  return {
    doc: UserInfo.findOne({ user: userName }) ? UserInfo.findOne({ user: userName }) : {},
    ready: subscription.ready(),
  };
})(EditProfile);
