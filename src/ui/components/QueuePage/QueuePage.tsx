import React, { useState, useEffect } from 'react'
import { AppQueue } from '../../../@types/app'
import { Store } from '../../hooks/useStore'
import { JobCard } from '../JobCard/JobCard'
import { QueueActions } from '../QueueActions/QueueActions'
import { StatusMenu } from '../StatusMenu/StatusMenu'
import s from './QueuePage.module.css'
import { formatDate } from '../JobCard/Timeline/Timeline'
import { Pagination } from '../Pagination/Pagination'
let timeOut: any = 0

const styles = {
  input: {
    padding: '10px 20px',
    border: '1px solid #0083dd',
  },
  wrapper: {
    marginBottom: 20,
    textAlign: 'right',
  } as any,
}

interface IUseChangeQueue {
  currentPage?: number
  limit?: number
  newQueues?: AppQueue
  searchValue?: string
}

export const QueuePage = ({
  selectedStatus,
  actions,
  queue,
}: {
  queue: AppQueue | undefined
  actions: Store['actions']
  selectedStatus: Store['selectedStatuses']
}) => {
  if (!queue) {
    return <section>Queue Not found</section>
  }
  const [search, setSearch] = useState<string>('')
  const [currentQueue, setCurrentQueue] = useState<AppQueue>({ ...queue })
  const [count, setCount] = useState<number>(currentQueue.jobs.length || 0)
  const [limit, setLimit] = useState<number>(10)
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [page, setPage] = useState<number>(Math.floor(count / limit))

  const useChangeQueue = ({
    currentPage = 1,
    limit = 0,
    newQueues = { ...queue },
    searchValue = '',
  }: IUseChangeQueue) => {
    if (searchValue) {
      newQueues.jobs = newQueues.jobs.filter((job) => {
        const { name, timestamp, processedOn, finishedOn, id } = job
        if (
          (name && name.toLowerCase().includes(searchValue)) ||
          (timestamp && formatDate(timestamp).includes(searchValue)) ||
          (processedOn && formatDate(processedOn).includes(searchValue)) ||
          (finishedOn && formatDate(finishedOn).includes(searchValue)) ||
          (id && id.toString().toLowerCase().includes(searchValue))
        ) {
          return job
        }
      })
    }

    const sliceFrom = (currentPage - 1) * limit

    if (limit) {
      const sliceTo = sliceFrom + limit
      newQueues.jobs = newQueues.jobs.slice(sliceFrom, sliceTo)
    } else {
      newQueues.jobs = newQueues.jobs.slice(sliceFrom)
    }

    setCount(newQueues.jobs.length || 0)

    return setCurrentQueue(newQueues)
  }

  useEffect(() => {
    useChangeQueue({ currentPage, limit, searchValue: search })
    setCount(queue.jobs.length || 0)
  }, [queue])

  const handleChangeInput = (e: any) => {
    const { value } = e.target
    if (value === search) {
      return
    }
    clearTimeout(timeOut)
    if (value) {
      const searchValue = value.toLowerCase()

      setSearch(searchValue)
      timeOut = setTimeout(() => {
        setCurrentPage(1)
        useChangeQueue({ limit: 0, currentPage: 1, searchValue })
      }, 300)
    } else {
      setSearch('')
      timeOut = setTimeout(() => {
        useChangeQueue({ limit, currentPage })
      }, 300)
    }
  }

  const handleChangeLimit = (value: number) => {
    const newPage = Math.ceil(count / value)
    setLimit(value)
    setPage(newPage)
    useChangeQueue({ currentPage, limit: value })
  }

  const handleChangePage = (value: number) => {
    setCurrentPage(value)
    useChangeQueue({ currentPage: value, limit })
  }

  return (
    <section>
      <div className={s.stickyHeader}>
        <StatusMenu
          queue={queue}
          selectedStatus={selectedStatus}
          onChange={actions.setSelectedStatuses}
        />
        {!queue.readOnlyMode && (
          <QueueActions
            queue={queue}
            actions={actions}
            status={selectedStatus[queue.name]}
          />
        )}
      </div>
      <div style={styles.wrapper}>
        <input
          style={styles.input}
          name="search"
          value={search}
          placeholder="Search"
          onChange={handleChangeInput}
        />
      </div>
      {currentQueue.jobs.map((job) => {
        return (
          <JobCard
            key={job.id}
            job={job}
            status={selectedStatus[currentQueue.name]}
            actions={{
              cleanJob: actions.cleanJob(currentQueue?.name)(job),
              promoteJob: actions.promoteJob(currentQueue?.name)(job),
              retryJob: actions.retryJob(currentQueue?.name)(job),
            }}
            readOnlyMode={currentQueue?.readOnlyMode}
          />
        )
      })}
      {!search && (
        <Pagination
          count={count}
          limit={limit}
          currentPage={currentPage}
          page={page}
          handleChangeLimit={handleChangeLimit}
          handleChangePage={handleChangePage}
        />
      )}
    </section>
  )
}
