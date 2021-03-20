import React, { useState, useEffect } from 'react'
import s from './Menu.module.css'
import { NavLink } from 'react-router-dom'

const prefix = 'not_pass'
let timeOut: any = 0

interface IUseChangeQueue {
  newQueues?: string[]
  searchValue?: string
}

export const Menu = ({ queues }: { queues: string[] | undefined }) => {
  const [search, setSearch] = useState('')
  const [currentQueue, setCurrentQueue] = useState(queues || [])
  const [loading, setLoading] = useState<boolean>(false)

  const useChangeQueue = ({
    newQueues = queues ? [...queues] : [],
    searchValue = '',
  }: IUseChangeQueue) => {
    if (searchValue) {
      newQueues = currentQueue?.filter((queueName) => {
        if (queueName && queueName.toLowerCase().includes(searchValue)) {
          return queueName
        }
      })
    }

    return setCurrentQueue(newQueues)
  }

  useEffect(() => {
    if (queues) {
      useChangeQueue({ searchValue: search })
      setLoading(true)
    }
  }, [queues])

  const handleChangeInput = (e: any) => {
    let { value } = e.target
    clearTimeout(timeOut)

    if (value) {
      value = value.toLowerCase()
      setSearch(value)
      timeOut = setTimeout(() => {
        useChangeQueue({ searchValue: value })
      }, 300)
    } else {
      setSearch('')
      timeOut = setTimeout(() => {
        useChangeQueue({})
      }, 300)
    }
  }

  return (
    <aside className={s.aside}>
      <div>QUEUES</div>
      <nav>
        {loading && (
          <ul className={s.menu}>
            <li key="search">
              <input
                className={s.input}
                name="search"
                value={search}
                placeholder="Search Queues"
                onChange={handleChangeInput}
              />
            </li>
            {currentQueue.map((queueName) => (
              <li key={queueName}>
                <NavLink
                  to={`/queue/${queueName}`}
                  activeClassName={s.active}
                  title={queueName}
                >
                  {prefix ? queueName.replace(prefix, '') : queueName}
                </NavLink>
              </li>
            ))}
          </ul>
        )}
      </nav>
      <div className={s.appVersion}>{process.env.APP_VERSION}</div>
    </aside>
  )
}
