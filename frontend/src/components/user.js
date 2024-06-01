import React, { useContext } from 'react';
import { useQuery } from '@tanstack/react-query'
import { AuthContext } from './auth.js';

import { api } from '../requests';

const useUser = () => {
    const { currentUser } = useContext(AuthContext);
    const userId = currentUser.id;
    const { isLoading: isPending, error, data: user } = useQuery({
        queryKey: ['user'],
        queryFn: () =>
          api.get("/users/find/"+userId).then(res => {
            return res.data
          }
          ),
      })

      return { isPending, error, user };
};

export default useUser;