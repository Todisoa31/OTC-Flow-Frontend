"use client";

import { useState } from "react";
import ConversationList from "./conversationList";
import SearchDiscussion from "./searchDiscussion";

export default function DiscussionList() {
    const [searchValue, setSearchValue] = useState<string>("");


    return (
        <div className=" w-full">
            <div className=" bg-primary-blue px-[30px] h-[100px] flex items-center w-full">
                <SearchDiscussion
                    value={searchValue}
                    setSearchValue={setSearchValue}
                />
            </div>
            <ConversationList searchValue={searchValue} />
        </div>
    )
};