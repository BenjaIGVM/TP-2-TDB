import React, { useContext, useState, useEffect } from "react";
import { UserContext } from "../utils/userContext";

import { AiOutlineLoading3Quarters } from "react-icons/ai";

import Home from "../components/Home";
import PostPublish from "../components/PostPublish";
import Post from "../components/Post";

const Feed = ({ showModal }) => {
  const [onRecomendations, setOnRecomendations] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const { user, addComment, removePost, likePost } = useContext(UserContext);

  useEffect(() => {
    let transitionTimeout = null;

    if (isTransitioning) {
      transitionTimeout = setTimeout(() => {
        setOnRecomendations((prevOn) => !prevOn);
        setIsTransitioning(false);
      }, 200);
    }

    return () => {
      if (transitionTimeout) {
        clearTimeout(transitionTimeout);
        setIsTransitioning(false);
      }
    };
  }, [isTransitioning]);

  return (
    <div className="z-10 mt-[80px]  w-[100vw] max-w-[100vw] text-current lg:w-[55vw] lg:max-w-[90vw] lg:px-10">
      <div className="ml-[10px]  mt-[20px] flex  w-[calc(100%-10px)] items-center  justify-between text-[5vw] font-bold sm:text-[18px] ">
        <h1 className="text-[20px] text-[5vw] font-bold text-secondary sm:text-[18px]">
          Publicaciones
        </h1>
        <button
          className={`ml-0 h-[40px] w-[30%] rounded-t-[10px] border-[2px] border-b-0 sm:ml-[5vw] sm:w-[35%] 
                    ${
                      !onRecomendations
                        ? "border-secondary bg-secondary text-background hover:border-primary hover:bg-background hover:text-primary"
                        : "border-secondary bg-background text-secondary"
                    }
                    `}
          onClick={() => {
            !onRecomendations && setIsTransitioning(true);
          }}
        >
          Novedades
        </button>
        <button
          className={`h-[40px]  w-[30%] rounded-t-[10px] border-[2px] border-b-0 sm:w-[35%] 
                    ${
                      onRecomendations
                        ? "border-secondary bg-secondary text-background hover:border-primary hover:bg-background hover:text-primary"
                        : "border-secondary bg-background text-secondary"
                    }`}
          onClick={() => {
            onRecomendations && setIsTransitioning(true);
          }}
        >
          Conocidos
        </button>
      </div>
      <div className="to-105% mb-[30px] mt-[-4px] h-[4px] w-[100%] bg-gradient-to-r from-transparent from-[-5%] via-secondary via-30% to-transparent" />

      <div
        className={`${
          isTransitioning ? "animate-horizontalOut" : "animate-horizontalIn"
        }`}
      >
        {(onRecomendations && (
          <RecomendationsFeed
            likePost={likePost}
            user={user}
            addComment={addComment}
            removePost={removePost}
            modal={showModal}
          />
        )) || (
          <FriendsFeed
            likePost={likePost}
            user={user}
            addComment={addComment}
            removePost={removePost}
            modal={showModal}
          />
        )}
      </div>
    </div>
  );
};

const FriendsFeed = ({ likePost, user, addComment, removePost, modal }) => {
  const { getFriendsPosts, friendsPosts, addPost } = useContext(UserContext);
  const [postsChecked, setPostsChecked] = useState(false);

  useEffect(() => {
    if (!friendsPosts || friendsPosts.length == 0) {
      getFriendsPosts(user.id).then(() => {
        setPostsChecked(true);
      });
    } else {
      setPostsChecked(true);
    }
  }, []);

  return (
    <>
      <PostPublish user={user} addPost={addPost} />
      {(postsChecked &&
        friendsPosts.map(
          (post) =>
            (!post.waiting && (
              <Post
                post={post}
                key={post.id}
                likePost={likePost}
                addComment={addComment}
                removePost={removePost}
                usuario={user}
                inFriends={true}
                modal={modal}
              />
            )) || <WaitingPost key={-1} />
        )) || (
        <div className="animate-bounce items-center text-center text-[20px] font-bold">
          <AiOutlineLoading3Quarters className="mx-auto mt-[20vh] h-[80px] w-[80px] animate-spin font-bold text-primary" />
          Cargando...
        </div>
      )}
    </>
  );
};

const RecomendationsFeed = ({
  user,
  addComment,
  likePost,
  removePost,
  modal,
}) => {
  const { getRecomendations, recomendations } = useContext(UserContext);
  const [postsChecked, setPostsChecked] = useState(false);

  useEffect(() => {
    if (!recomendations || recomendations.length == 0) {
      getRecomendations(user.id).then(() => {
        setPostsChecked(true);
      });
    } else {
      setPostsChecked(true);
    }
  }, []);

  return (
    <>
      {(postsChecked &&
        recomendations.map((post) => (
          <Post
            post={post}
            key={post.id}
            likePost={likePost}
            addComment={addComment}
            removePost={removePost}
            usuario={user}
            inFriends={false}
            modal={modal}
          />
        ))) || (
        <div className="animate-bounce items-center text-center text-[20px] font-bold">
          <AiOutlineLoading3Quarters className="mx-auto mt-[30vh] h-[80px] w-[80px] animate-spin font-bold text-primary" />
          Cargando...
        </div>
      )}
    </>
  );
};

const WaitingPost = () => {
  return (
    <div className="mb-[20px]  h-[150px] max-h-[150px] w-full animate-pulse items-center rounded-[10px] bg-foreground p-[10px] text-center text-[20px] font-bold shadow-2xl">
      <div className="flex px-[20px] opacity-60">
        <div className="mr-[10px] h-[75px] w-[75px] rounded-[10px] bg-secondary"></div>

        <div className="flex-1 space-y-6 py-1">
          <div className="h-3 rounded bg-secondary "></div>

          <div className="space-y-3">
            <div className="grid grid-cols-3 gap-4">
              <div className="col-span-2 h-3 rounded bg-secondary"></div>
              <div className="col-span-1 h-3 rounded bg-secondary"></div>
            </div>
            <div className="h-3 rounded bg-secondary"></div>
          </div>
        </div>
      </div>

      <div className="relative mt-[-4%] w-[100%] text-center font-bold text-primary">
        Creando publicacion...
      </div>

      <AiOutlineLoading3Quarters className="relative top-[-80%]  mx-auto mb-[10px]  h-[60px] w-[60px] animate-spin font-bold text-primary" />
    </div>
  );
};

Feed.getLayout = function getLayout(page, screenWidth) {
  return <Home screenWidth={screenWidth}>{page}</Home>;
};

export default Feed;
