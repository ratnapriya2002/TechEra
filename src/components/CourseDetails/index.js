import {Component} from 'react'

import Loader from 'react-loader-spinner'

import './index.css'

const status = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

class Home extends Component {
  state = {isLoading: true, course: [], responseStatus: status.initial}

  componentDidMount() {
    this.getCoursesList()
  }

  getCoursesList = async () => {
    const {match} = this.props
    const {params} = match
    const {id} = params
    const url = `https://apis.ccbp.in/te/courses/${id}`
    const response = await fetch(url)
    if (response.ok === true) {
      const data = await response.json()
      const convertedData = {
        id: data.course_details.id,
        name: data.course_details.name,
        imageUrl: data.course_details.image_url,
        description: data.course_details.description,
      }
      this.setState({
        isLoading: false,
        course: convertedData,
        responseStatus: status.success,
      })
    } else {
      this.setState({isLoading: false, responseStatus: status.failure})
    }
  }

  onSuccessCourses = () => {
    const {course} = this.state
    console.log(course)
    return (
      <div>
        <img src={course.imageUrl} alt={course.name} />
        <div>
          <h1>{course.name}</h1>
          <p>{course.description}</p>
        </div>
      </div>
    )
  }

  onRetry = () => {
    this.setState({isLoading: true}, this.getCoursesList)
  }

  onFailureCourses = () => (
    <div>
      <img
        src="https://assets.ccbp.in/frontend/react-js/tech-era/failure-img.png"
        alt="failure view"
      />
      <h1>Oops! Something Went Wrong</h1>
      <p>We cannot seem to find the page you are looking for.</p>
      <button type="button" onClick={this.onRetry}>
        Retry
      </button>
    </div>
  )

  renderCourses = () => {
    const {responseStatus} = this.state
    switch (responseStatus) {
      case status.success:
        return this.onSuccessCourses()
      case status.failure:
        return this.onFailureCourses()
      default:
        return null
    }
  }

  renderLoader = () => (
    <div data-testid="loader">
      <Loader type="TailSpin" color="#00BFFF" height={50} width={50} />
    </div>
  )

  render() {
    const {isLoading} = this.state
    return <div>{isLoading ? this.renderLoader() : this.renderCourses()}</div>
  }
}

export default Home