import React, { useState, useEffect } from 'react'
import s from './Pagination.module.css'

interface IProps {
  count: number
  limit: number
  currentPage: number
  page: number
  handleChangeLimit: (value: number) => void
  handleChangePage: (value: number) => void
}

const listPaginationLimitOption: number[] = [10, 20, 50, 100]

export const Pagination = (props: IProps) => {
  const {
    limit: propsLimit,
    page: propsPage,
    currentPage: propsCurrentPage,
    count: propsCount,
  } = props

  const [limit, setLimit] = useState<number>(20)
  const [page, setPage] = useState<number>(1)
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [count, setCount] = useState<number>(0)

  useEffect(() => {
    setLimit(propsLimit)
    setPage(propsPage)
    setCurrentPage(propsCurrentPage)
    setCount(propsCount)
  }, [props])

  const handleChangeLimit = (e: any) => {
    const { value } = e.target
    e.preventDefault()
    setLimit(Number(value))
    props.handleChangeLimit(Number(value))
  }

  const handleChangePage = (value: any) => {
    value = Number(value) > page ? page : Number(value)
    setPage(Number(value))
    props.handleChangePage(Number(value))
  }

  const handleDecrease = (e: any) => {
    e.preventDefault()
    const newCurrentPage = currentPage === 1 ? 1 : currentPage - 1
    setCurrentPage(newCurrentPage)
    return props.handleChangePage(newCurrentPage)
  }

  const handleIncrease = (e: any) => {
    e.preventDefault()
    const newCurrentPage = currentPage < page ? currentPage + 1 : page
    setCurrentPage(newCurrentPage)
    return props.handleChangePage(newCurrentPage)
  }

  const handleFirstPage = (e: any) => {
    e.preventDefault()
    setCurrentPage(1)
    return props.handleChangePage(1)
  }

  const handleLastPage = (e: any) => {
    e.preventDefault()
    setCurrentPage(page)
    return props.handleChangePage(page)
  }

  const renderListOption = () => {
    return listPaginationLimitOption.map((item, idx) => {
      return (
        <option value={item} key={idx}>
          {item}
        </option>
      )
    })
  }

  const renderListPagination = () => {
    const allListPage = Array.from(Array(page + 1), (_, i) => i)

    const listPage =
      currentPage === 1
        ? allListPage.slice(currentPage, currentPage + 2)
        : allListPage.slice(currentPage - 1, currentPage + 2)

    return listPage.map((item, idx) => {
      return (
        <li
          className={
            item === currentPage ? `${s.pageItem} ${s.active}` : s.pageItem
          }
          onClick={() => handleChangePage(item)}
          key={idx}
        >
          <div className={s.pageLink}>{item}</div>
        </li>
      )
    })
  }

  return (
    <div className={s.pagination}>
      <div>
        <ul className={s.justifyContentCenter}>
          <li className={s.pageItem} data-disabled={currentPage < 2}>
            <div className={s.pageLink} onClick={handleFirstPage}>
              &lt;&lt;
            </div>
          </li>
          <li className={s.pageItem} data-disabled={currentPage < 2}>
            <div className={s.pageLink} onClick={handleDecrease}>
              &lt;
            </div>
          </li>
          {renderListPagination()}
          <li className={s.pageItem} data-disabled={currentPage >= page}>
            <div className={s.pageLink} onClick={handleIncrease}>
              &gt;
            </div>
          </li>
          <li className={s.pageItem} data-disabled={currentPage >= page}>
            <div className={s.pageLink} onClick={handleLastPage}>
              &gt;&gt;
            </div>
          </li>
        </ul>
      </div>
      <div>
        <div className={s.showConsiseTable}>
          <span>Display</span>
          <select
            className={s.customSelect}
            value={limit}
            onChange={handleChangeLimit}
          >
            {renderListOption()}
          </select>
          <span>
            Total <b>{count}</b>
          </span>
        </div>
      </div>
    </div>
  )
}
