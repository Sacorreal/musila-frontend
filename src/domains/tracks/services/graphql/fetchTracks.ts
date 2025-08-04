import { getClient } from "@/lib/client";
import { TRACK_QUERY } from "../graphql/querys/queryTest";

import { ApolloError } from "@apollo/client";
import { Track } from "./../../types/tracks";

interface FetchTracksResult {
  tracks: Track[] | null;
  loading: boolean;
  error: ApolloError | null;
}

export async function fetchTracks(): Promise<FetchTracksResult> {
  const client = getClient();

  try {
    const { data, loading } = await client.query({
      query: TRACK_QUERY,
    });

    return {
      tracks: data || [],
      loading,
      error: null,
    };
  } catch (error) {
    return {
      tracks: null,
      loading: false,
      error: error as ApolloError,
    };
  }
}
