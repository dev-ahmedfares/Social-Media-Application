export interface INewUser {
  name: string;
  username: string;
  email: string;
  password: string;
}

export type IUser = {
  id: string;
  name: string;
  username: string;
  email: string;
  imageUrl: string;
  bio: string;
};

export type INavLink = {
  label: string;
  route: string;
  imgURL: string;
};

export type INewPost = {
  userId: string;
  caption: string;
  file: File[];
  location?: string;
  tags?: string;
};


export type IUpdatedPost = {
  postId:string;
  imageUrl:URL,
  imageId:string,
  file: File[];
  caption: string;
  location?: string;
  tags?: string;
}

export type IUpdateProfile = {
  userId:string,
  file:File[],
  name:string,
  imageId: string;
  imageUrl: URL | string;
  bio:string,
}