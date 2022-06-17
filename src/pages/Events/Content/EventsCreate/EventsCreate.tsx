import * as React from 'react'
import type { RouteComponentProps } from 'react-router'
import { Form, Field } from 'react-final-form'
import arrayMutators from 'final-form-arrays'
import TEMPLATE from './Template'
import type { UploadedFile } from 'src/pages/common/UploadedFile/UploadedFile'
import { Button, FieldDatepicker, FieldInput } from 'oa-components'
import type { EventStore } from 'src/stores/Events/events.store'
import { Heading, Card, Flex, Box, Text } from 'theme-ui'
import { TagsSelectField } from 'src/components/Form/TagsSelect.field'
import { inject } from 'mobx-react'
import { PostingGuidelines } from './PostingGuidelines'
import type { IEventFormInput } from 'src/models/events.models'
import { LocationSearchField } from 'src/components/Form/LocationSearch.field'
import styled from '@emotion/styled'
import theme from 'src/themes/styled.theme'
import { validateUrl, addProtocolMutator, required } from 'src/utils/validators'
import ElWithBeforeIcon from 'src/components/ElWithBeforeIcon'
import IconHeaderEvents from 'src/assets/images/header-section/events-header-icon.svg'
import { logger } from 'src/logger'
import { CheckboxInput } from 'src/components/Form/Checkbox'

interface IState {
  formValues: IEventFormInput
  formSaved: boolean
  showSubmitModal?: boolean
  selectedDate: any
  isLocationSelected?: boolean
}
type IProps = RouteComponentProps<any>
interface IInjectedProps extends IProps {
  eventStore: EventStore
}

const FormContainer = styled.form`
  width: 100%;
`

const Label = styled.label`
  font-size: ${theme.fontSizes[2] + 'px'};
  margin-bottom: ${theme.space[2] + 'px'};
`

// const AnimatedDiv = styled.div`
//   transition: height 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
// `

@inject('eventStore')
export class EventsCreate extends React.Component<IProps, IState> {
  uploadRefs: { [key: string]: UploadedFile | null } = {}
  constructor(props: any) {
    super(props)
    // generate unique id for db and storage references and assign to state
    this.state = {
      formValues: { ...TEMPLATE.INITIAL_VALUES },
      formSaved: false,
      selectedDate: null,
    }
  }

  get injected() {
    return this.props as IInjectedProps
  }
  get store() {
    return this.injected.eventStore
  }

  public onSubmit = async (formValues: IEventFormInput) => {
    logger.debug('form values', formValues)
    await this.store.uploadEvent(formValues)
    this.props.history.push('/events')
  }

  public handleChange = (date: any) => {
    this.setState({
      selectedDate: date,
    })
  }

  public render() {
    const { formValues, isLocationSelected, selectedDate } = this.state

    return (
      <Form
        onSubmit={(v) => {
          const datepickerDate = selectedDate
          // convert from Date type to yyyy/mm/dd string and back into local timezone
          const convert = new Date(
            datepickerDate.getTime() -
              datepickerDate.getTimezoneOffset() * 60000,
          )
            .toISOString()
            .substring(0, 10)
          v.date = convert
          this.onSubmit(v as IEventFormInput)
        }}
        initialValues={formValues}
        mutators={{
          ...arrayMutators,
          addProtocolMutator,
        }}
        validateOnBlur
        render={({ form: { mutators }, submitting, handleSubmit }) => {
          return (
            <Flex mx={-2} bg={'inherit'} sx={{ flexWrap: 'wrap' }}>
              <Flex
                bg="inherit"
                px={2}
                sx={{ width: ['100%', '100%', `${(2 / 3) * 100}%`] }}
                mt={4}
              >
                <FormContainer onSubmit={(e) => e.preventDefault()}>
                  {/* How To Info */}
                  <Flex sx={{ flexDirection: 'column' }}>
                    <Card>
                      <Flex
                        bg={theme.colors.softblue}
                        sx={{ alignItems: 'center', padding: 3 }}
                      >
                        <Heading>Create an event</Heading>
                        <Box ml="15px">
                          <ElWithBeforeIcon
                            IconUrl={IconHeaderEvents}
                            height="20px"
                          />
                        </Box>
                      </Flex>
                    </Card>
                    <Box
                      sx={{ mt: '20px', display: ['block', 'block', 'none'] }}
                    >
                      <PostingGuidelines />
                    </Box>
                    <Card mt={5} p={4} sx={{ overflow: 'visible' }}>
                      <Flex sx={{ flexDirection: 'column', flexWrap: 'wrap' }}>
                        <Flex
                          mb={3}
                          sx={{
                            width: ['100%', '100%', `${(2 / 3) * 100}%`],
                            flexDirection: 'column',
                          }}
                        >
                          <Label htmlFor="title">Title of the event *</Label>
                          <Field
                            id="title"
                            name="title"
                            data-cy="title"
                            validate={required}
                            validateFields={[]}
                            modifiers={{ capitalize: true }}
                            component={FieldInput}
                            maxLength="140"
                            placeholder="Title of your event (max 140 characters)"
                          />
                        </Flex>
                        <Flex
                          mx={-2}
                          sx={{
                            width: '100%',
                            flexDirection: ['column', 'column', 'row'],
                          }}
                        >
                          <Flex
                            mb={3}
                            px={2}
                            sx={{ width: '100%', flexDirection: 'column' }}
                            data-cy="date"
                          >
                            <Label htmlFor="date">
                              When is your event taking place? *
                            </Label>
                            <Field
                              className="datepicker"
                              component={FieldDatepicker}
                              name="date"
                              type="date"
                              validate={required}
                              selected={this.state.selectedDate}
                              data-cy="input-date"
                              customChange={(date) => {
                                const formattedDate = date.target
                                  ? new Date(date.target.value)
                                  : date
                                this.handleChange(formattedDate)
                              }}
                            />
                          </Flex>

                          <Flex
                            mb={3}
                            px={2}
                            sx={{ width: '100%', flexDirection: 'column' }}
                          >
                            <Label htmlFor="url">Link to your event *</Label>
                            <Field
                              name="url"
                              data-cy="url"
                              validateFields={[]}
                              validate={(value) => validateUrl(value)}
                              component={FieldInput}
                              placeholder="URL to offsite link (Facebook, Meetup, etc)"
                              customOnBlur={(e) =>
                                mutators.addProtocolMutator(e.target.name)
                              }
                            />
                          </Flex>
                        </Flex>
                        <Flex
                          mx={-2}
                          sx={{
                            width: '100%',
                            flexDirection: ['column', 'column', 'row'],
                          }}
                        >
                          <Flex
                            mb={3}
                            px={2}
                            sx={{
                              width: '100%',
                              flexDirection: 'column',
                            }}
                          >
                            {!formValues?.isDigital && (
                              <>
                                <Label htmlFor="location">
                                  In which city is the event taking place? *
                                </Label>
                                <Field
                                  id="location"
                                  name="location"
                                  className="location-search-create"
                                  validateFields={[]}
                                  validate={required}
                                  customChange={() => {
                                    this.setState({
                                      isLocationSelected: true,
                                    })
                                  }}
                                  component={LocationSearchField}
                                />
                                {isLocationSelected !== undefined &&
                                  !isLocationSelected && (
                                    <Text
                                      color={theme.colors.red}
                                      mb="5px"
                                      sx={{ fontSize: 1 }}
                                    >
                                      Select a location for your event
                                    </Text>
                                  )}
                              </>
                            )}
                            <Flex my={3} sx={{ alignItems: 'center' }}>
                              <Field
                                type="checkbox"
                                id="isDigital"
                                name="isDigital"
                                labelText=" This is a digital event"
                                component={CheckboxInput}
                              ></Field>
                            </Flex>
                          </Flex>
                          <Flex
                            mb={3}
                            px={2}
                            sx={{ width: '100%', flexDirection: 'column' }}
                          >
                            <Label htmlFor="location">
                              Select tags for your event *
                            </Label>
                            <Field
                              name="tags"
                              component={TagsSelectField}
                              category="event"
                            />
                          </Flex>
                        </Flex>
                      </Flex>
                    </Card>
                  </Flex>
                </FormContainer>
              </Flex>

              {/* post guidelines container */}
              <Flex
                sx={{
                  width: [`100%`, `100%`, `${(1 / 3) * 100}%`],
                  flexDirection: 'column',
                  height: '100%',
                }}
                bg="inherit"
                px={2}
                mt={4}
              >
                <Box sx={{ display: ['none', 'none', 'block'] }}>
                  <PostingGuidelines />
                </Box>
                <Button
                  onClick={() => {
                    if (isLocationSelected) {
                      handleSubmit()
                    } else {
                      this.setState({ isLocationSelected: false })
                    }
                  }}
                  mt={3}
                  variant={'primary'}
                  disabled={submitting}
                  data-cy="submit"
                  sx={{ mb: ['40px', '40px', 0], width: '100%' }}
                >
                  Publish
                </Button>
              </Flex>
            </Flex>
          )
        }}
      />
    )
  }
}
