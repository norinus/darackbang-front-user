import React, {useEffect, useState} from "react";
import {
    Navbar,
    Typography,
    Button,
    IconButton
} from "@material-tailwind/react";
import {Link, useNavigate} from "react-router-dom";
import {FaShoppingCart, FaUserCircle} from "react-icons/fa";
import {useDispatch, useSelector} from 'react-redux';
import {logoutPost} from "../../apis/MemberApi";
import useExeptionHandler from "../../hooks/useExeptionHandler";

export function StickyNavbar() {
    const loginState = useSelector(state => state.loginState)
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [searchValue, setSearchValue] = useState("");
    const {exceptionHandle} = useExeptionHandler();

    // 컴포넌트가 마운트될 때 로그인 상태 초기화
    useEffect(() => {
        const storedLoginState = localStorage.getItem('loginState'); // localStorage에서 로그인 상태 가져오기
        if (storedLoginState) {
            dispatch({type: 'SET_LOGIN_STATE', payload: storedLoginState}); // Redux 스토어에 상태 설정
        } else {
            dispatch({type: 'SET_LOGIN_STATE', payload: '비회원'}); // 초기 상태 설정
        }
    }, [dispatch]);

    // 페이지가 변경될 때 검색어 초기화 및 이벤트 컴포넌트와 상품목록 컴포넌트 렌더링
    useEffect(() => {
        const handlePopState = () => {
            const currentUrl = window.location.href;
            if (currentUrl === "http://localhost:3000/") {
                setSearchValue(""); // 검색어 초기화
                dispatch({ type: 'SET_SEARCH_VALUE', payload: null }); // Redux에서 검색어 초기화
            }
        };

        window.addEventListener("popstate", handlePopState);
        return () => {
            window.removeEventListener("popstate", handlePopState);
        };
    }, [dispatch]);

    const handleLogoutClick = () => {
        logoutPost()
            .then(status => {
                console.log(status)
                alert("로그아웃 되었습니다.")
                localStorage.removeItem('loginState'); // localStorage에서 로그인 상태 제거
                localStorage.removeItem('accessToken'); // localStorage에서 액세스 토큰 제거
                dispatch({type: 'SET_LOGIN_STATE', payload: '비회원'});
                navigate("/")

            })
            .catch((error) => {
                exceptionHandle(error)
                /*
                console.log("에러 발생:", error)
                alert("예상하지 못한 오류가 발생했습니다. 다시 시도해주세요.")*/
            })
    }

    const handleMypage = () => {
        {
            loginState === "비회원" ? (
                alert("로그인 후 이용할 수 있습니다.")
            ) : navigate("/mypage/info")
        }
    }

    const handleCart = () => {
        {
            loginState === "비회원" ? (
                alert("로그인 후 이용할 수 있습니다.")
            ) : navigate("/cart")
        }
    }

    const handleSearchSubmit = (e) => {
        e.preventDefault(); // 이벤트 막기
        if (!searchValue.trim()) { // 검색어가 비어있는지 확인
            return; // 빈 경우 아무 동작도 하지 않음
        }
        //디스페처를 동한 값 설정
        dispatch({type: 'SET_SEARCH_VALUE', payload: searchValue});
        //검색을 하면 상품 리스트로 이동
        navigate(`/list?search=${encodeURIComponent(searchValue)}`); // 쿼리 파라미터를 사용하여 검색어 전달
    };

    const handleOnClickLogo = () => {
        dispatch({type: 'SET_SEARCH_VALUE', payload: null});
        setSearchValue(""); // 검색어 초기화
        navigate("/"); // 기본 페이지로 이동
    }

    const navList = (
        <ul className="flex ml-10 flex-row items-center gap-10"> {/* 수평 정렬과 간격을 위한 클래스 수정 */}
            <Typography
                as="li"
                variant="small"
                color="blue-gray"
                className="p-1 font-normal text-base"
            >
                <Link to={"brand"} className="flex items-center">
                    <Typography className={"font-semibold"}>
                        브랜드
                    </Typography>
                </Link>
            </Typography><Typography
                as="li"
                variant="small"
                color="blue-gray"
                className="p-1 font-normal text-base"
            >
                <Link to={"/event"} className="flex items-center">
                    <Typography className={"font-semibold"}>
                        이벤트
                    </Typography>
                </Link>
            </Typography>
            <form className="max-w-7xl mx-auto ml-10" onSubmit={handleSearchSubmit}> {/* ml-10 추가로 더 큰 여백 */}
                <label htmlFor="default-search"
                       className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">검색</label>
                <div className="relative">
                    <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                        <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true"
                             xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                  d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
                        </svg>
                    </div>
                    <input
                        type="search"
                        value={searchValue}
                        onChange={(e) => setSearchValue(e.target.value)} // Update search value
                        className="block w-96 p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        placeholder="상품 이름"
                    />
                    <button type="submit"
                            className="text-white absolute end-2.5 bottom-2.5 bg-gray-800 hover:bg-gray-600 focus:bg-gray-800 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-200">검색
                    </button>
                </div>
            </form>
        </ul>
    );

    return (
        <div className="-m-6 max-h-[768px] w-[calc(100%+48px)] overflow-y-scroll overflow-x-hidden">
            <Navbar className="sticky top-0 z-10 h-max max-w-full rounded-none ml-2 px-4 py-2 lg:px-8 lg:pt-4">
                <div className="flex mt-4 items-center justify-start text-blue-gray-900"> {/* justify-start로 왼쪽 정렬 */}
                    <Link href="/" className="mr-4 cursor-pointer py-1.5">
                        <img
                            src='/images/darackbang_logo.png'
                            alt="다락방"
                            className="max-w-48 h-auto"
                            onClick={handleOnClickLogo}
                        />
                    </Link>
                    <div className="flex items-center gap-4">{navList}</div>
                    {/* navList를 포함하는 div */}
                    <div className="flex items-center gap-x-1 ml-auto"> {/* Login, Logout 버튼 오른쪽 정렬 */}
                        <div className="flex">
                            {loginState === "비회원" ? (
                                <>
                                    <Link to={"/login"}>
                                        <Button
                                            variant="text"
                                            size="sm"
                                            className="lg:inline-block bg-gray-200 mr-1.5"
                                        >
                                            <span className={"text-base font-bold"}>로그인</span>
                                        </Button>
                                    </Link>
                                    <Link to={"/member/join"}>
                                        <Button
                                            variant="gradient"
                                            size="sm"
                                            className="lg:inline-block"
                                        >
                                            <span className={"text-base"}>회원가입</span>
                                        </Button>
                                    </Link>
                                </>
                            ) : (
                                <Button
                                    variant="gradient"
                                    size="sm"
                                    className="lg:inline-block"
                                    onClick={handleLogoutClick}
                                >
                                    <span className={"text-base"}>로그아웃</span>
                                </Button>
                            )}
                        </div>
                        {/* 장바구니 버튼 */}
                        <IconButton onClick={handleCart}>
                            <FaShoppingCart className={"size-5"}/>
                        </IconButton>
                        {/* 마이페이지 버튼 */}
                        <IconButton onClick={handleMypage}>
                            <FaUserCircle className={"size-5"}/>
                        </IconButton>
                    </div>
                </div>
            </Navbar>
        </div>
    );
}

const BasicMenu = () => {
    return (
        <StickyNavbar/>
    );
}

export default BasicMenu;
