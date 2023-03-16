import {Component} from 'react'

import {Link} from 'react-router-dom'

import Loader from 'react-loader-spinner'

import './index.css'

const status = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

class Home extends Component {
  state = {isLoading: true, coursesList: [], responseStatus: status.initial}

  componentDidMount() {
    this.getCoursesList()
  }

  getCoursesList = async () => {
    const url = 'https://apis.ccbp.in/te/courses'
    const response = await fetch(url)
    if (response.ok === true) {
      const data = await response.json()
      const convertedData = data.courses.map(item => ({
        id: item.id,
        name: item.name,
        logoUrl: item.logo_url,
      }))
      this.setState({
        isLoading: false,
        coursesList: convertedData,
        responseStatus: status.success,
      })
    } else {
      this.setState({isLoading: false, responseStatus: status.failure})
    }
  }

  onSuccessCourses = () => {
    const {coursesList} = this.state
    return (
      <div>
        <h1>Courses</h1>
        <ul>
          {coursesList.map(item => (
            <Link to={`/courses/${item.id}`} key={item.id}>
              <li>
                <img src={item.logoUrl} alt={item.name} />
                <p>{item.name}</p>
              </li>
            </Link>
          ))}
        </ul>
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