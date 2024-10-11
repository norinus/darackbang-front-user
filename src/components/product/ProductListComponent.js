import {useEffect, useState} from "react";
import useCustomMove from "../hooks/useCustomMove";
import {getList} from "../../apis/productApi";
import PageComponent from "../common/PageComponent";

import {API_SERVER_HOST} from "../../apis/host";

const initState = {
    contents: [],
    pageNumbers: [],
    prev: false,
    next: false,
    totalCount: 0,
    prevPage: 0,
    nextPage: 0,
    totalPage: 0,
    currentPage: 0,
    search:null
}

const ProductListComponent = () => {

    const {page, size, refresh, moveToList, moveToRead} = useCustomMove()

    const [serverData, setServerData] = useState(initState)

    // State to track which search field (productName or salePrice) is selected
    const [searchType, setSearchType] = useState("productName"); // Default to productName
    const [searchValue, setSearchValue] = useState(""); // Value entered in the input field

    useEffect(() => {
        const params = {
            page,
            size,
            productName: searchType === "productName" ? searchValue : null,
            salePrice: searchType === "salePrice" ? searchValue : null,
        };

        getList(params).then(data => {
            // 현재 페이지 정보 추가
            const currentPage = params.page; // 현재 요청한 페이지
            setServerData({
                ...data,
                current: currentPage, // current에 현재 페이지 설정
            });
        }).catch(error => {
            // 예외 처리
        });
    }, [page, size, refresh, searchValue, searchType]);

    return (
        <section className="w-full"> {/* 전체 너비로 설정하고 배경색 추가 */}
            <div className="flex justify-center"> {/* 가로 방향으로 가운데 정렬 */}
                <div className="max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {serverData.contents.map((product) => (
                            <div
                                key={product.id}
                                className="mx-auto sm:mr-0 group cursor-pointer lg:mx-auto bg-white transition-all duration-500"
                                onClick={() => moveToRead(product.id)}
                            >
                                <div className="">
                                    {product.productImages.length > 0 && (
                                        <img
                                            src={`${API_SERVER_HOST}/api/products/view/thumbnail_${
                                                product.productImages
                                                    .filter(image => image.productType === "INFO") // productType이 INFO인 이미지 필터링
                                                    .map(image => image.productFileName)[0] // 첫 번째 이미지 파일명 가져오기
                                            }`}
                                            alt={product.productName}
                                            className="w-full aspect-square rounded-2xl object-cover"
                                        />
                                    )}
                                </div>
                                <div className="mt-5">
                                    <div className="flex items-center justify-between">
                                        <h6 className="font-semibold text-xl leading-8 text-black transition-all duration-500 group-hover:text-indigo-600 tracking-tight">
                                            {product.productName}
                                        </h6>
                                        <h6 className="font-semibold text-xl leading-8 text-indigo-600 text-right">
                                            {product.salePrice.toLocaleString()}원
                                        </h6>
                                    </div>
                                    <p className="mt-2 font-normal text-sm leading-6 text-gray-500 tracking-tight">
                                        {product.productDetail || "상품 설명이 존재하지 않습니다."}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <br/>

            {/* Pagination 컴포넌트 */}
            <PageComponent serverData={serverData} movePage={moveToList}></PageComponent>
        </section>

    );
}

export default ProductListComponent;