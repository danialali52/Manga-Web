import { useLocation, Link } from "react-router-dom";
import { useState, useEffect, useLayoutEffect } from "react";
import { getList } from "../getData";
import MangaCard from "./MangaCard";
import Loading from "./Loading";
import { handleURL, getUrlStatus, getUrlSort } from "../getData";

function Options({ options, sort, status, linkStatus, linkSort }) {
  const [category, setCategory] = useState(false);

  const handleCategory = () => {
    setCategory((prev) => !prev);
  };

  let sortDisplay;

  let statusDisplay;

  switch (sort) {
    case "0":
      sortDisplay = "A-z";
      break;
    case "1":
      sortDisplay = "Z-a";
      break;
    case "2":
      sortDisplay = "Mới cập nhật";
      break;
    case "3":
      sortDisplay = "Truyện mới";
      break;
    case "4":
      sortDisplay = "Xem nhiều";
      break;
    case "5":
      sortDisplay = "Yêu thích nhiều";
      break;
    default:
      sortDisplay = "A-z";
  }

  switch (status) {
    case "0":
      statusDisplay = "Đang tiến hành";
      break;
    case "1":
      statusDisplay = "Tạm ngưng";
      break;
    case "2":
      statusDisplay = "Hoàn thành";
      break;
    default:
      statusDisplay = "Tất cả";
  }

  const sortArr = [
    "A-z",
    "Z-a",
    "Mới cập nhật",
    "Truyện mới",
    "Xem nhiều",
    "Yêu thích nhiều",
  ];

  const statusArr = ["Đang tiến hành", "Tạm ngưng", "Hoàn thành"];

  let tableOptions;

  if (options !== "sort") {
    tableOptions = statusArr.map((item, index) => (
      <li key={index} className={"py-1 select-none"}>
        <Link key={index} to={`${linkSort}&status=${index}`}>
          {item}
        </Link>
      </li>
    ));
  } else {
    tableOptions = sortArr.map((item, index) => (
      <li key={index} className={"py-1 select-none"}>
        <Link to={`${linkStatus}&sort=${index}`}>{item}</Link>
      </li>
    ));
  }

  return (
    <div
      className="min-w-[100px] w-fit bg-slights dark:bg-sdarks mr-3 flex items-center justify-center
      py-2 px-3 rounded-md hover:cursor-pointer dark:text-white relative mb-2 lg:mb-6
    "
      onClick={handleCategory}
    >
      <span className="font-medium  select-none">
        {options === "sort"
          ? "Sắp xếp theo: " + sortDisplay
          : "Trạng thái: " + statusDisplay}
      </span>
      <i
        className={
          "bx pl-1" + (category ? " bx-chevron-up" : " bx-chevron-down")
        }
      ></i>

      <ul
        className={
          "absolute h-fit w-full bg-slights dark:bg-sdarks rounded-md top-[110%] left-0 py-1 px-2 duration-150 origin-top-right" +
          (options === "sort" ? " z-30" : " z-10") +
          (category ? " scale-100" : " scale-0")
        }
      >
        {tableOptions}
      </ul>
    </div>
  );
}

function Mangas({ data, del, setDel, history }) {
  const deleteHandle = () => {
    const localData = JSON.parse(localStorage.getItem("manga-history"));

    const newLocalData = [];

    localData.filter((manga) => {
      if (!(data.mangaEP === manga.mangaEP)) {
        newLocalData.push(manga);
      }
    });

    localStorage.setItem("manga-history", JSON.stringify(newLocalData));
    setDel(!del);
  };

  return data ? (
    <>
      <div className="col s-6 c-2">
        <div className="w-full">
          <MangaCard
            mangaEP={data.mangaEP}
            cover={data.cover}
            title={data.title}
          />
          {history ? (
            <div className="flex items-center justify-center mb-3 select-none">
              <div
                onClick={deleteHandle}
                className="bg-red-500 py-1 px-3 rounded-md text-white flex items-center justify-center cursor-pointer"
              >
                <i className="bx bx-x text-xl"></i>
                <span>Xóa</span>
              </div>
            </div>
          ) : (
            false
          )}
        </div>
      </div>
    </>
  ) : (
    false
  );
}

function PageBtn({ index, ep, currpage, totalPages, linkList }) {
  let button;

  if (index === Number(currpage) + 1 && index < totalPages - 2) {
    button = (
      <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-slights dark:bg-sdarks dark:text-white text-sm font-medium text-gray-700">
        ...
      </span>
    );
  } else if (
    (index > Number(currpage) && index < totalPages - 1) ||
    index < Number(currpage) - 2
  ) {
    button = false;
  } else {
    button = (
      <Link
        key={index}
        to={`${linkList}${ep}`}
        aria-current="page"
        onClick={() => {
          window.scrollTo(0, 0);
        }}
        className={
          "z-10 relative inline-flex items-center px-4 py-2 border text-sm font-medium " +
          (index === Number(currpage) - 1
            ? " bg-primary text-white"
            : " bg-slights dark:bg-sdarks dark:text-white border-gray-300 text-gray-500 hover:bg-gray-50")
        }
      >
        {index + 1}
      </Link>
    );
  }

  return button;
}

function Paginations({ data, currpage, linkList }) {
  const totalPages = data.totalPages;

  const arrPages = [];

  const handleArrPages = () => {
    for (let i = 1; i <= totalPages; i++) {
      arrPages.push(`&page=${i}`);
    }
  };

  handleArrPages();

  return (
    <div className="px-4 py-3 flex items-center justify-between sm:px-6">
      <div className="flex-1 flex items-center justify-center">
        <div>
          <nav
            className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
            aria-label="Pagination"
          >
            <Link
              to={`${linkList}&page=1`}
              onClick={() => {
                window.scrollTo(0, 0);
              }}
              className="relative inline-flex items-center px-2 py-2 rounded-l-md border dark:text-white border-gray-300 bg-slights dark:bg-sdarks text-sm font-medium text-gray-500 hover:bg-gray-50"
            >
              <span className="sr-only">Previous</span>
              <i className="bx bxs-chevrons-left"></i>
            </Link>

            {arrPages.map((ep, index) => (
              <PageBtn
                linkList={linkList}
                key={index}
                ep={ep}
                currpage={currpage}
                index={index}
                totalPages={totalPages}
              />
            ))}

            <Link
              to={`${linkList}&page=${totalPages}`}
              onClick={() => {
                window.scrollTo(0, 0);
              }}
              className="relative inline-flex items-center px-2 py-2 rounded-r-md border dark:text-white border-gray-300 bg-slights dark:bg-sdarks text-sm font-medium text-gray-500 hover:bg-gray-50"
            >
              <span className="sr-only">Next</span>
              <i className="bx bxs-chevrons-right"></i>
            </Link>
          </nav>
        </div>
      </div>
    </div>
  );
}

export default function ListManga() {
  const [data, setData] = useState(false);
  const [del, setDel] = useState(false);

  let location = useLocation();
  let query = new URLSearchParams(location.search);

  const list = query.get("list");
  const genre = query.get("genre");
  const status = query.get("status");
  const sort = query.get("sort") ? query.get("sort") : 0;
  const page = query.get("page") ? query.get("page") : 1;
  let history = query.get("history");

  const filter = {
    list,
    genre,
    status,
    sort,
    page,
  };

  let linkList = handleURL(filter);
  let linkStatus = getUrlStatus(filter);
  let linkSort = getUrlSort(filter);
  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    setData(false);
    if (!history) {
      linkList = handleURL(filter);
      getList(filter).then((data) => setData(data));
    } else {
      const historyData = localStorage.getItem("manga-history");

      if (historyData) {
        setData(JSON.parse(historyData));
      } else {
        setData(false);
      }
    }
  }, [location, del]);

  return (
    <div className="grid wide">
      {!history ? (
        <>
          <div className="row">
            <div className="col c-12 flex lg:items-center lg:justify-start flex-col lg:flex-row">
              <Options
                options="sort"
                sort={sort}
                linkStatus={linkStatus}
                linkSort={linkSort}
              />
              <Options
                options="status"
                status={status}
                linkStatus={linkStatus}
                linkSort={linkSort}
              />
            </div>
          </div>
          <div className="row">
            {data.mangas ? (
              data.mangas.map((manga, i) => <Mangas key={i} data={manga} />)
            ) : (
              <Loading />
            )}
          </div>
          <div className="row">
            <div className="col c-12">
              {data ? (
                <Paginations data={data} currpage={page} linkList={linkList} />
              ) : (
                false
              )}
            </div>
          </div>
        </>
      ) : (
        <div className="row">
          {data && Array.isArray(data) ? (
            data.map((manga, i) => (
              <Mangas
                key={i}
                data={manga}
                del={del}
                setDel={setDel}
                history={history}
              />
            ))
          ) : (
            <Loading />
          )}
        </div>
      )}
    </div>
  );
}
